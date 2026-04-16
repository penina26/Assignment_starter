import { useEffect, useState } from 'react'
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API = "http://127.0.0.1:5000";
function App() {
  const [students, setStudents] = useState([]);
  const [name, setName] = useState("");
  const [course, setCourse] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");


  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/students`);
      setStudents(response.data);
    } catch (error) {
      console.error("Error fetching students:", error);
      toast.error("Failed to fetch students.")
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Handle form submit for create/update

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setMessage("name is required")
      return;
    }
    const payload = {
      name,
      course,
    };

    try {
      if (editingId) {
        await axios.patch(`${API}/students/${editingId}`, payload);
        toast.success("Student updated successfully.");
      } else {
        await axios.post(`${API}/students`, payload);
        toast.success("Student created successfully.");
      }
      setName("");
      setCourse("");
      setEditingId(null);
      fetchStudents();
    } catch (error) {
      console.error("Error saving student:", error);
      toast.error("Failed to save student.");
    }
  };

  // Fill form for editing

  const handleEdit = (student) => {
    setName(student.name);
    setCourse(student.course || "");
    setEditingId(student.id);
    setMessage("");
  };



  // Delete student
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/students/${id}`);
      toast.success("Student deleted successfully.");

      if (editingId === id) {
        setEditingId(null);
        setName("");
        setCourse("");
      }

      fetchStudents();
    } catch (error) {
      console.error("Error deleting student:", error);
      toast.error("Failed to delete student.");
    }
  };

  // Cancel edit
  const handleCancel = () => {
    setEditingId(null);
    setName("");
    setCourse("");
    setMessage("");
  };

  return (
    <div style={{ maxWidth: "900px", margin: "40px auto", fontFamily: "Arial" }}>
      <h1>Student CRUD App</h1>

      {message && (
        <p style={{ padding: "10px", background: "#f4f4f4", borderRadius: "6px" }}>
          {message}
        </p>
      )}

      <form onSubmit={handleSubmit} style={{ marginBottom: "30px" }}>
        <div style={{ marginBottom: "10px" }}>
          <input
            type="text"
            placeholder="Enter student name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ width: "100%", padding: "10px" }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <input
            type="text"
            placeholder="Enter course"
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            style={{ width: "100%", padding: "10px" }}
          />
        </div>

        <button type="submit" style={{ marginRight: "10px", padding: "10px 16px" }}>
          {editingId ? "Update Student" : "Add Student"}
        </button>

        {editingId && (
          <button type="button" onClick={handleCancel} style={{ padding: "10px 16px" }}>
            Cancel
          </button>
        )}
      </form>

      <h2>Students List</h2>

      {loading ? (
        <p>Loading...</p>
      ) : students.length === 0 ? (
        <p>No students found.</p>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "20px",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#f4f4f4" }}>
              <th style={{ border: "1px solid #ddd", padding: "12px", textAlign: "left" }}>ID</th>
              <th style={{ border: "1px solid #ddd", padding: "12px", textAlign: "left" }}>Name</th>
              <th style={{ border: "1px solid #ddd", padding: "12px", textAlign: "left" }}>Course</th>
              <th style={{ border: "1px solid #ddd", padding: "12px", textAlign: "left" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td style={{ border: "1px solid #ddd", padding: "12px" }}>{student.id}</td>
                <td style={{ border: "1px solid #ddd", padding: "12px" }}>{student.name}</td>
                <td style={{ border: "1px solid #ddd", padding: "12px" }}>
                  {student.course || "No course"}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "12px" }}>
                  <button
                    onClick={() => handleEdit(student)}
                    style={{ marginRight: "10px", padding: "8px 12px" }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(student.id)}
                    style={{ padding: "8px 12px" }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );


}

export default App