from flask import Blueprint,render_template,request,redirect,url_for
from ..models.settings import Setting,db

settings = Blueprint("settings",__name__)

@settings.get("/")
def index():
    setting = Setting.query.first()
    return render_template("settings.html",title="Settings",setting=setting)

@settings.post("/")
def save_settings():
    settings = Setting.query.first()

    sitename = request.form.get("sitename","Notething")
    theme = request.form.get("theme")
    auth_key = request.form.get("authkey",None)

    if not settings:
        add_settings = Setting(site_name=sitename,theme=theme,auth_key=auth_key)
        db.session.add(add_settings)
        db.session.commit()

    else:
        settings.sitename = sitename
        settings.theme = theme 
        settings.auth_key = auth_key
        db.session.commit()

    return redirect(url_for("notes.index"))
