import React, { useState } from 'react';
import { useToast } from './hooks/useToast';

function App() {
	const [title, setTitle] = useState('Test');
	const [message, setMessage] = useState(
		'Lorem ipsum dolor sit amet, consectetur adipiscing elit. '
	);
	const [itemType, setType] = useState('default');

	// invoke the useToast hook to create toast notification
	const toast = useToast();
	const handleCreateToast = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		toast({ itemType, title, message });
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
						<option value='default'>Default</option>
						<option value='SUCCESS'>Success</option>
						<option value='ERROR'>Error</option>
					</select>
				</span>
				<button>Create Toast</button>
			</form>
		</div>
	);
}

export default App;
