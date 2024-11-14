from flask import Blueprint,render_template,redirect,url_for,request,session,current_app
from ..models.settings import Setting

auth = Blueprint("auth",__name__)

@auth.route("/login")
def login():
    return render_template("auth.html")

@auth.post("/login")
def login_user():
    _pass = request.form.get("password")
    pass_key = current_app.config["auth"]

    settings = Setting.query.first() 

    if settings:
        pass_key = settings.auth_key

    if _pass == pass_key:
        session["auth"] = True
        return redirect(url_for("notes.index"))
    return "invalid password",403

@auth.post("/logout")
def logout():
    session.clear()
    return redirect(url_for("auth.login"))
