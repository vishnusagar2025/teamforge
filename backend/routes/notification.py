from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from database.db import db
from models.notification import Notification

notification_bp = Blueprint("notification", __name__)

@notification_bp.route("/", methods=["GET"])
@jwt_required()
def get_notifications():
    user_id = int(get_jwt_identity())
    notifs = Notification.query.filter_by(user_id=user_id).order_by(Notification.created_at.desc()).limit(30).all()
    return jsonify([n.to_dict() for n in notifs]), 200

@notification_bp.route("/<int:notif_id>/read", methods=["PUT"])
@jwt_required()
def mark_read(notif_id):
    notif = Notification.query.filter_by(id=notif_id, user_id=int(get_jwt_identity())).first_or_404()
    notif.is_read = True
    db.session.commit()
    return jsonify({"message": "Marked as read"}), 200

@notification_bp.route("/read-all", methods=["PUT"])
@jwt_required()
def mark_all_read():
    Notification.query.filter_by(user_id=int(get_jwt_identity()), is_read=False).update({"is_read": True})
    db.session.commit()
    return jsonify({"message": "All marked as read"}), 200
