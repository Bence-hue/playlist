pip install pipenv
xcopy build playlist\frontend\build /s /y
pipenv run python playlist\manage.py runserver 0.0.0.0:8000