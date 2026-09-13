from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from database import get_db
from models import User, Identity, Assignment
from dependencies import get_current_user

router = APIRouter(
    prefix="/draw",
    tags=["Secret Santa Draw"]
)


def can_complete_draw(
    db: Session,
    giver_id: int,
    recipient_id: int
) -> bool:

    users = db.query(User).all()
    assignments = db.query(Assignment).all()

    assigned_givers = {
        assignment.giver_id
        for assignment in assignments
    }

    assigned_recipients = {
        assignment.recipient_id
        for assignment in assignments
    }

    remaining_givers = [
        user
        for user in users
        if user.id not in assigned_givers
        and user.id != giver_id
    ]

    remaining_recipients = [
        user
        for user in users
        if user.id not in assigned_recipients
        and user.id != recipient_id
    ]

    if len(remaining_givers) != len(remaining_recipients):
        return False

    possibilities = {}

    for giver in remaining_givers:
        possibilities[giver.id] = [
            recipient.id
            for recipient in remaining_recipients
            if recipient.id != giver.id
        ]

    if any(
        len(options) == 0
        for options in possibilities.values()
    ):
        return False

    matched = set()

    def find_match(giver_id, visited):
        for recipient_id in possibilities[giver_id]:

            if recipient_id in visited:
                continue

            visited.add(recipient_id)

            if (
                recipient_id not in matched
                or find_match(matched_recipient_giver[recipient_id], visited)
            ):
                matched.add(recipient_id)
                matched_recipient_giver[recipient_id] = giver_id
                return True

        return False

    matched_recipient_giver = {}

    ordered_givers = sorted(
        possibilities,
        key=lambda giver_id: len(possibilities[giver_id])
    )

    for giver_id in ordered_givers:
        if not find_match(giver_id, set()):
            return False

    return True


@router.get("/available")
def get_available_identities(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    user_count = db.query(User).count()

    if user_count < 11:
        raise HTTPException(
            status_code=400,
            detail=f"The draw cannot open yet. {user_count}/11 participants have registered."
        )

    if current_user.has_drawn:
      assignment = db.query(Assignment).filter(
        Assignment.giver_id == current_user.id
    ).first()

      if assignment:
        recipient = db.query(User).filter(
            User.id == assignment.recipient_id
        ).first()

        return {
            "has_drawn": True,
            "recipient": recipient.name,
            "available_count": db.query(Identity).filter(
                Identity.is_picked == False
            ).count()
        }

    identities = db.query(Identity).filter(
        Identity.is_picked == False,
        Identity.user_id != current_user.id
    ).all()

    available = []

    for identity in identities:

        if can_complete_draw(
            db,
            current_user.id,
            identity.user_id
        ):

            available.append({
                "id": identity.id,
                "name": identity.name
            })

    return available


@router.post("/{identity_id}")
def make_draw(
    identity_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    user_count = db.query(User).count()

    if user_count < 11:
        raise HTTPException(
            status_code=400,
            detail=f"The draw cannot open yet. {user_count}/11 participants have registered."
        )

    if current_user.has_drawn:
        raise HTTPException(
            status_code=400,
            detail="You have already completed your Secret Santa draw."
        )

    identity = db.query(Identity).filter(
        Identity.id == identity_id
    ).first()

    if identity is None:
        raise HTTPException(
            status_code=404,
            detail="Secret identity not found."
        )

    if identity.is_picked:
        raise HTTPException(
            status_code=400,
            detail="That identity has already been picked."
        )

    if identity.user_id == current_user.id:
        raise HTTPException(
            status_code=400,
            detail="You cannot pick your own identity."
        )

    if not can_complete_draw(
        db,
        current_user.id,
        identity.user_id
    ):
        raise HTTPException(
            status_code=400,
            detail="That identity cannot be selected because it would prevent the draw from being completed."
        )

    claimed = db.query(Identity).filter(
        Identity.id == identity_id,
        Identity.is_picked == False
    ).update(
        {Identity.is_picked: True},
        synchronize_session=False
    )

    if claimed != 1:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail="That identity has already been picked. Please choose another one."
        )

    assignment = Assignment(
        giver_id=current_user.id,
        recipient_id=identity.user_id
    )

    db.add(assignment)
    current_user.has_drawn = True

    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail="Your draw could not be completed because that identity was just picked. Please choose another one."
        )

    return {
        "message": "Congratulations! You've picked your Secret Santa!",
        "recipient": identity.user.name
    }
@router.get("/my-assignment")
def get_my_assignment(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    assignment = db.query(Assignment).filter(
        Assignment.giver_id == current_user.id
    ).first()

    if not assignment:
        return {
            "has_drawn": False,
            "recipient": None
        }

    recipient = db.query(User).filter(
        User.id == assignment.recipient_id
    ).first()

    if not recipient:
        raise HTTPException(
            status_code=404,
            detail="Assignment recipient not found."
        )

    return {
        "has_drawn": True,
        "recipient": recipient.name
    }
