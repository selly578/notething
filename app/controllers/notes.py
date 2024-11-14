from flask import Blueprint,render_template,redirect,url_for,request 
from markdown import markdown 
from datetime import datetime
import pytz
from ..models.notes import Note,Category,db 

notes  = Blueprint("notes",__name__)

@notes.get("")
def index():
    notes = Note.query.all()
    return render_template("index.html",notes=notes,title="Notething")

@notes.get("/create")
def create():
    categories = Category.query.all()
    return render_template("create.html",title="New notes",categories=categories)

@notes.post("/create")
def save_create():        
    # Get the current time in UTC and convert to GMT+8
    utc_time = datetime.utcnow()
    gmt8_zone = pytz.timezone("Asia/Jakarta")
    gmt8_time = utc_time.replace(tzinfo=pytz.utc).astimezone(gmt8_zone)

    print(request.form.get("content"))
    category = Category.query.filter_by(id=int(request.form.get("category"))).first() 
    new_note = Note(title=request.form.get("title"),content=request.form.get("content"),category=category,created_at=gmt8_time)
    db.session.add(new_note)
    db.session.commit()
    return redirect(url_for("notes.index"))

@notes.get("/<int:id>/edit")
def edit(id):
    note = db.get_or_404(Note,id)
    categories = Category.query.all()
    print(note)
    return render_template("create.html",note=note,title="Edit",categories=categories)

@notes.post("/<int:id>/edit")
def save_edit(id):
    note = db.get_or_404(Note,id)

    utc_time = datetime.utcnow()
    gmt8_zone = pytz.timezone("Asia/Singapore")  # GMT+8 timezone
    gmt8_time = utc_time.replace(tzinfo=pytz.utc).astimezone(gmt8_zone)

    category = Category.query.filter_by(id=int(request.form.get("category"))).first()
    note.title = request.form.get("title")
    note.content = request.form.get("content")
    note.updated_at = gmt8_time
    note.category = category

    db.session.commit()

    return redirect(url_for("notes.note",id=note.id))

@notes.get("/<int:id>")
def note(id):
    note = db.get_or_404(Note,id)
    content = markdown(note.content)

    return render_template("note.html",note=note,title=note.title,content=content)

@notes.post("/<int:id>/delete")
def delete(id):
    note = db.get_or_404(Note,id)

    db.session.delete(note)
    db.session.commit()

    return redirect(url_for("notes.index"))
@notes.get("/categories")
def categories():
    categories = Category.query.all()
    return render_template("categories.html",title="Categories",categories=categories)

@notes.get("/categories/add")
def categories_add():
    return render_template("create_category.html",title="Add new category")

@notes.post("categories/add")
def categories_save():
    name = request.form.get("name")
    description = request.form.get("description")

    category = Category(name=name,description=description)
    db.session.add(category)
    db.session.commit()

    return redirect(url_for("notes.categories"))

@notes.get("categories/<int:id>")
def categories_note(id):
    category = Category.query.filter_by(id=id).first()
    notes = Note.query.filter_by(category=category).all()

    return render_template("index.html",notes=notes,title=f"{category.name} category",category=category)

@notes.get("/categories/edit/<int:id>")
def categories_edit(id):
    category = db.get_or_404(Category,id)

    return render_template("create_category.html",category=category,title=f"Edit category {category.name}")

@notes.post("/categories/edit/<int:id>")
def categories_save_edit(id):
    category = db.get_or_404(Category,id)

    category.name = request.form.get("name")
    category.description = request.form.get("description")

    db.session.commit()

    return redirect(url_for("notes.categories"))

@notes.post("/categories/delete/<int:id>")
def delete_category(id):
    category = db.get_or_404(Category,id)

    db.session.delete(category)
    db.session.commit()

    return redirect(url_for("notes.categories"))
