FROM python:3.13-slim

WORKDIR /app

COPY mi-proyecto/requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY mi-proyecto/app.py .

COPY mi-proyecto/app ./app

EXPOSE 5000

CMD ["python", "app.py"]