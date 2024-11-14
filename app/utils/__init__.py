from datetime import datetime,timedelta
from ..models.settings import Setting
from .. import app 

@app.template_filter("humanize_date")
def humanize_date(value):
    
    now = datetime.now()
    date_format = '%I:%M %p'  # Hour:Minute AM/PM format

    if value.date() == now.date():
        return f"Today {value.strftime(date_format)}"
    elif value.date() == (now - timedelta(days=1)).date():
        return f"Yesterday {value.strftime(date_format)}"
    else:
        # Show as Month Day, Year if older than yesterday
        return value.strftime(f"%b %d, %Y {date_format}")

@app.context_processor 
def settings():
    settings = Setting.query.first()
    
    theme = "default"
    
    if settings:
        theme = settings.theme
    

    return {"settings": settings,"theme": theme}
