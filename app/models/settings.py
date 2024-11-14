from .. import db 

class Setting(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    site_name =  db.Column(db.String(80), nullable=False,default="Notething")
    theme = db.Column(db.String(80), nullable=False,default="default")
    auth = db.Column(db.Boolean,default=False)
    auth_key = db.Column(db.String(80),nullable=True)

