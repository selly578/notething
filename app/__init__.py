from flask import Flask,session,redirect,url_for,render_template,request
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
db = SQLAlchemy()
migrate = Migrate()


def create_app():
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///notes.db"
    app.config["auth"] = "pda2oraora"
    app.config["SECRET_KEY"] = "secret"
    db.init_app(app)
    migrate.init_app(app,db)

    # import blueprint and register it 
    from .controllers.notes import notes
    from .controllers.auth import auth
    from .controllers.settings import settings 

    app.register_blueprint(notes,url_prefix="/")
    app.register_blueprint(auth,url_prefix="/auth")
    app.register_blueprint(settings,url_prefix="/settings")

    #import utils 
    from .utils import humanize_date
    
    # import models
    from .models.notes import Note,Category
    from .models.settings import Setting
    
    @app.before_request
    def restrict_access():
        if app.config.get('auth') and request.endpoint != 'auth.login_user' and request.endpoint != "auth.login" and request.endpoint != 'static':
            if 'auth' not in session:
                return redirect(url_for('auth.login'))
    return app 
