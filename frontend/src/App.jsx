import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:8080/api/students";

function App() {

  const [students, setStudents] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    course: "",
    city: ""
  });

  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {

    try {

      setLoading(true);
      setError("");

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to fetch students");
      }

      const data = await response.json();

      setStudents(data);

    } catch (error) {

      setError(error.message);

    } finally {

      setLoading(false);

    }
  };

  const handleChange = (event) => {

    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (event) => {

    event.preventDefault();

    try {

      setError("");

      const url = editingId
          ? `${API_URL}/${editingId}`
          : API_URL;

      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error("Failed to save student");
      }

      resetForm();

      await fetchStudents();

    } catch (error) {

      setError(error.message);

    }
  };

  const handleEdit = (student) => {

    setFormData({
      name: student.name,
      email: student.email,
      course: student.course,
      city: student.city
    });

    setEditingId(student.id);

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const handleDelete = async (id) => {

    const confirmDelete = window.confirm(
        "Are you sure you want to delete this student?"
    );

    if (!confirmDelete) {
      return;
    }

    try {

      setError("");

      const response = await fetch(
          `${API_URL}/${id}`,
          {
            method: "DELETE"
          }
      );

      if (!response.ok) {
        throw new Error("Failed to delete student");
      }

      await fetchStudents();

    } catch (error) {

      setError(error.message);

    }
  };

  const resetForm = () => {

    setFormData({
      name: "",
      email: "",
      course: "",
      city: ""
    });

    setEditingId(null);
  };

  return (
      <div className="app">

        <header className="header">
          <h1>Student Management System</h1>
          {/*<p>*/}
          {/*  Spring Boot + Hibernate + MySQL + React*/}
          {/*</p>*/}
        </header>

        <main className="container">

          <section className="form-card">

            <h2>
              {editingId
                  ? "Update Student"
                  : "Add Student"}
            </h2>

            <form onSubmit={handleSubmit}>

              <div className="form-grid">

                <div className="form-group">
                  <label>Name</label>

                  <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter student name"
                      required
                  />
                </div>

                <div className="form-group">
                  <label>Email</label>

                  <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter email"
                      required
                  />
                </div>

                <div className="form-group">
                  <label>Course</label>

                  <input
                      type="text"
                      name="course"
                      value={formData.course}
                      onChange={handleChange}
                      placeholder="Enter course"
                      required
                  />
                </div>

                <div className="form-group">
                  <label>City</label>

                  <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="Enter city"
                      required
                  />
                </div>

              </div>

              <div className="form-buttons">

                <button
                    type="submit"
                    className="primary-button"
                >
                  {editingId
                      ? "Update Student"
                      : "Add Student"}
                </button>

                {editingId && (
                    <button
                        type="button"
                        className="secondary-button"
                        onClick={resetForm}
                    >
                      Cancel
                    </button>
                )}

              </div>

            </form>

          </section>

          {error && (
              <div className="error-message">
                {error}
              </div>
          )}

          <section className="students-card">

            <div className="students-header">

              <h2>Students</h2>

              <button
                  className="refresh-button"
                  onClick={fetchStudents}
              >
                Refresh
              </button>

            </div>

            {loading ? (

                <p className="message">
                  Loading students...
                </p>

            ) : students.length === 0 ? (

                <p className="message">
                  No students found.
                </p>

            ) : (

                <div className="table-container">

                  <table>

                    <thead>

                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Course</th>
                      <th>City</th>
                      <th>Actions</th>
                    </tr>

                    </thead>

                    <tbody>

                    {students.map((student) => (

                        <tr key={student.id}>

                          <td>
                            {student.id}
                          </td>

                          <td>
                            {student.name}
                          </td>

                          <td>
                            {student.email}
                          </td>

                          <td>
                            {student.course}
                          </td>

                          <td>
                            {student.city}
                          </td>

                          <td>

                            <div className="actions">

                              <button
                                  className="edit-button"
                                  onClick={() =>
                                      handleEdit(student)
                                  }
                              >
                                Edit
                              </button>

                              <button
                                  className="delete-button"
                                  onClick={() =>
                                      handleDelete(student.id)
                                  }
                              >
                                Delete
                              </button>

                            </div>

                          </td>

                        </tr>

                    ))}

                    </tbody>

                  </table>

                </div>

            )}

          </section>

        </main>

      </div>
  );
}

export default App;