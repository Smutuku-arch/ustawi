import React, { useEffect, useState } from 'react';
import { listUsers, setUserRole, uploadBook, listBooks, deleteBook } from '../api/admin';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [books, setBooks] = useState([]);
  const [file, setFile] = useState(null);
  const [cover, setCover] = useState(null);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [error, setError] = useState('');

  async function loadAll() {
    setError('');
    try {
      const [u, b] = await Promise.all([listUsers(), listBooks()]);
      setUsers(u);
      setBooks(b);
    } catch (err) {
      setError(err.message || 'Load error');
    }
  }

  useEffect(() => {
    loadAll();
  }, []);

  async function onRoleChange(userId, role) {
    try {
      await setUserRole(userId, role);
      await loadAll();
    } catch (err) {
      setError(err.message || 'Role change failed');
    }
  }

  async function onUpload(e) {
    e.preventDefault();
    if (!file) return setError('Select a book file');
    const fd = new FormData();
    fd.append('file', file);
    if (cover) fd.append('cover', cover);
    fd.append('title', title);
    fd.append('author', author);
    try {
      await uploadBook(fd);
      setFile(null); setCover(null); setTitle(''); setAuthor('');
      await loadAll();
    } catch (err) {
      setError(err.message || 'Upload failed');
    }
  }

  async function onDeleteBook(id) {
    try {
      await deleteBook(id);
      await loadAll();
    } catch (err) {
      setError(err.message || 'Delete failed');
    }
  }

  return (
    <div>
      <h3>Admin Dashboard</h3>
      {error && <div style={{ color: 'red' }}>{error}</div>}

      <section>
        <h4>Users</h4>
        <table>
          <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Change</th></tr></thead>
          <tbody>
            {users.map(u => (
              <tr key={u._id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>
                  <select value={u.role} onChange={(e) => onRoleChange(u._id, e.target.value)}>
                    <option value="user">user</option>
                    <option value="admin">admin</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section>
        <h4>Upload Book</h4>
        <form onSubmit={onUpload}>
          <div>
            <label>Title<input value={title} onChange={e=>setTitle(e.target.value)} /></label>
          </div>
          <div>
            <label>Author<input value={author} onChange={e=>setAuthor(e.target.value)} /></label>
          </div>
          <div>
            <label>Book File<input type="file" onChange={e=>setFile(e.target.files[0])} /></label>
          </div>
          <div>
            <label>Cover (optional)<input type="file" onChange={e=>setCover(e.target.files[0])} /></label>
          </div>
          <button type="submit">Upload</button>
        </form>
      </section>

      <section>
        <h4>Books</h4>
        <ul>
          {books.map(b => (
            <li key={b._id}>
              <strong>{b.title}</strong> by {b.author || '—'} uploaded by {b.uploadedBy?.email || '—'}
              {' '}<a href={b.fileUrl} target="_blank" rel="noreferrer">Download</a>
              {' '}<button onClick={()=>onDeleteBook(b._id)}>Delete</button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
