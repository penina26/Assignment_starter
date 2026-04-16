from flask import Flask, request,jsonify
from flask_cors import CORS


app = Flask(__name__)

CORS(app)

class Student:
    def __init__(self, id, name, course=None):
        self.id = id
        self.name = name
        self.course = course

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "course": self.course
        }
    
students = [
    Student(1, "Akida Mwaura", "Software Development"),
    Student(2, "Mike John", "Cyber Security")

]

@app.route("/")
def home():
    return "Welcome to Student API"

#fetch students
@app.route("/students", methods=["GET"])
def fetch_students():
    return jsonify([student.to_dict() for student in students])

#create student
@app.route("/students", methods=["POST"])
def create_student():
    data = request.get_json()
    
    if not data or "name" not in data:
        return jsonify({"error": "Name is required"}), 400
    
    new_id = max([student.id for student in students], default=0) +1
    new_student = Student(
        id= new_id,
        name=data["name"],
        course=data.get("course")
    )
    students.append(new_student)
    return jsonify(new_student.to_dict()), 201

# Get one Student
@app.route('/students/<int:id>', methods=["GET"])
def get_student(id):
    student = next((s for s in students if s.id == id), None)
    if not student:
        return jsonify({"error": "Student not found"}), 404
    return jsonify(student.to_dict())

#update student
@app.route('/students/<int:id>', methods=["PATCH"])
def update_student(id):
    student = next((s for s in students if s.id == id), None)
    if not student:
        return jsonify({"error": "Student not found"}), 404

    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400

    student.name = data.get("name", student.name)
    student.course = data.get("course", student.course)

    return jsonify(student.to_dict())


# delete student
@app.route('/students/<int:id>', methods=["DELETE"])
def delete_student(id):
    global students
    student = next((s for s in students if s.id == id), None)
    if not student:
        return jsonify({"error": "Student not found"}), 404

    students = [s for s in students if s.id != id]
    return jsonify({"message": "Student deleted successfully"})

if __name__ == "__main__":
    app.run(debug=True)