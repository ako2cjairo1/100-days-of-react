import React, { useState } from 'react';
import { Toast } from './components/Toast';
import { v4 } from 'uuid';
import { ToastProps } from './components/Toast/Toast';

function App() {
	const [title, setTitle] = useState('');
	const [message, setMessage] = useState('');
	const [itemType, setType] = useState('');
	const [toasts, setToast] = useState<ToastProps[]>([]);

	const handleCreateToast = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setToast([...toasts, { id: v4(), title, message, itemType }]);
	};

	const handleRemove = (id: string) => {
		console.log('Callback (handleRemove): ', id);
		const tempToasts = toasts.slice().filter((i) => i.id !== id);
		setToast(tempToasts);
	};

	return (
		<div className='App'>
			<form className='container' onSubmit={(e) => handleCreateToast(e)}>
				{' '}
				<span>
					<label htmlFor='title'>Title:</label>
					<input id='title' type='text' value={title} onChange={(e) => setTitle(e.target.value)} />
				</span>
				<span>
					<label htmlFor='message'>Message:</label>
					<input
						id='message'
						type='text'
						value={message}
						onChange={(e) => setMessage(e.target.value)}
					/>
				</span>
				<span>
					<label htmlFor='toast-type'>Message:</label>
					<select id='toast-type' value={itemType} onChange={(e) => setType(e.target.value)}>
						<option value=''>Default</option>
						<option value='SUCCESS'>Success</option>
						<option value='ERROR'>Error</option>
					</select>
				</span>
				<button>Create Toast</button>
			</form>
			<div className='notification-wrapper'>
				{toasts.map((toast) => {
					return <Toast key={toast.id} {...toast} callback={handleRemove} />;
				})}
			</div>
		</div>
	);
}

export default App;
