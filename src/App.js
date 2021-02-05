import { useState, useEffect } from 'react';
import EditModal from './Components/editModal';
import EditPubModal from './Components/editPubModal';
import './App.css';
import { Table, Button } from 'react-bootstrap';
import { SERVER_ADDR } from './constants';


function App() {


	const [editingUser, setEditingUser] = useState({});
	const [editingPub, setEditingPub] = useState({});
	const [users, setUsers] = useState([]);
	const [pubs, setPubs] = useState([]);
	const [showModal, setShowModal] = useState(false);
	const [showPubModal, setShowPubModal] = useState(false);
	const [selectedPubs, setSelectedPubs] = useState({});
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {

		fetch(SERVER_ADDR + '/users/pub')
			.then(res => res.json())
			.then(users => {
				console.log(users)
				setIsLoading(false);
				setUsers(users);
			})
	}, [setIsLoading]);

	useEffect(() => {

		fetch(SERVER_ADDR + '/publications')
			.then(res => res.json())
			.then(pubs => {
				console.log(pubs)
				setIsLoading(false);
				setPubs(pubs);
			})
	}, [setIsLoading]);

	const handleCloseModal = () => {
		setShowModal(false);
		setShowPubModal(false);
		setEditingUser({});
	}

	const handleShowModal = () => setShowModal(true);

	const addPub = (pubData) => {
		console.log(pubData)
		fetch(SERVER_ADDR + '/users/pub/' + editingUser._id, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(pubData),
		})
		.then(response => response.json())
		.then(updatedUser => {
			console.log('Success:', updatedUser);
			const idx = users.findIndex(user => user._id === editingUser._id);
			const newUsers = [
				...users.slice(0, idx),
				updatedUser,
				...users.slice(idx + 1)
			];
			setUsers(newUsers);
		});
	};

	const editPub = (pubData) => {
		console.log(pubData)
		fetch(SERVER_ADDR + '/publications/' + editingPub._id, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(pubData),
		})
		.then(response => response.json())
		.then(updatedPub => {
			let idx = pubs.findIndex(pub => pub._id === editingPub._id);
			const newPubs = [
				...pubs.slice(0, idx),
				{
					_id: editingPub._id,
					...pubData
				},
				...pubs.slice(idx+1),
				
			];
			setPubs(newPubs);
		});
	};

	const handleCheckboxClick = (pub, event) => {
		setSelectedPubs({
			...selectedPubs,
			[pub._id]: event.target.checked ? pub : undefined
		});
	};

	const deleteSelectedPubs = () => {
		const newPubs = pubs.filter(pub => selectedPubs[pub._id] === undefined);
		Object.values(selectedPubs).forEach(pub => {
			fetch(SERVER_ADDR + '/publications/' + pub._id, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
				}
			})
			.then(response => response.json())
			.then(res => {
				console.log(res);
			});
		});

		setPubs(newPubs);
		setSelectedPubs({});
	};

	const editSelectedUser = (editedUser) => {
		const userIndex = users.findIndex(user => user._id === editedUser._id);
		fetch(SERVER_ADDR + '/' + editedUser._id, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(editedUser),
		})
			.then(response => response.json())
			.then(res => {
				console.log(res);
			});

		if (userIndex !== -1) {
			const newUsers = [
				...users.slice(0, userIndex),
				editedUser,
				...users.slice(userIndex + 1)
			]
			setUsers(newUsers);
		}
		setEditingUser({});

	};

	return (
		<div className="App" >
			<div style={{ height: '50%' }}>
				
				<Table striped bordered hover>
					<thead>
						<tr>
							<th>#</th>
							<th>First Name</th>
							<th>Last Name</th>
							<th>User email</th>
							<th>publications</th>
						</tr>
					</thead>
					<tbody>
						{
							users.map(user => {
								//const pubString = (user.publications||[]).reduce((prev, pub) => prev + ', ' + pub.title, '')
								const pubString = (user.publications||[]).map(pub => pub.title).join(', ');
								return (
									<tr key={user._id} onDoubleClick={() => { setEditingUser(user); setShowModal(true); }}>
										<td>{user._id}</td>
										<td>{user.firstName}</td>
										<td>{user.lastName}</td>
										<td>{user.email}</td>
										<td>{pubString}</td>
									</tr>
								);
							})
						}
					</tbody>
				</Table>

				<EditModal
					showModal={showModal}
					handleCloseModal={handleCloseModal}
					editSelectedUser={editSelectedUser}
					addPub={addPub}
				>

				</EditModal>
			</div>
			
			<div style={{ height: '50%' }}>
			<Button onClick={deleteSelectedPubs}>Delete Selected Publications </Button>
				<Table striped bordered hover>
					<thead>
						<tr>
							<th>#</th>
							<th>title</th>
							<th>year</th>
						</tr>
					</thead>
					<tbody>
						{
							pubs.map(pub => {

								return (
									<tr key={pub._id} onDoubleClick={() => { setEditingPub(pub); setShowPubModal(true); }}>
										<td>{pub._id}
											<input
												type="checkbox"
												name={pub._id}
												onChange={(event) => handleCheckboxClick(pub, event)}>

											</input>
										</td>
										<td>{pub.title}</td>
										<td>{pub.year}</td>

									</tr>
								);
							})
						}
					</tbody>
				</Table>

				<EditPubModal
					showModal={showPubModal}
					handleCloseModal={handleCloseModal}
					editSelectedUser={editSelectedUser}
					editPub={editPub}
					inputs={editingPub}
				>
				</EditPubModal>
			</div>


		</div>
	);
}

export default App;
