
const submiBtn = document.getElementById('submit');
const deleteBtn = document.getElementById('delete');
const userID = document.getElementById('idNum');

window.onload = ()=> {
	let storedRecord = JSON.parse(window.localStorage.getItem("recordCollection"));
	recordCollection = storedRecord;
	userTable(recordCollection);
	checkIdLength();
}

	//change the submit and delete buttons if Employee ID is provided for update
	function checkIdLength() {
		if (userID.value.length > 0) {
		submiBtn.setAttribute("value", "Update Record");
		deleteBtn.style.display = 'inline-block';
	} else {
		submiBtn.setAttribute("value", "Add Record");
		deleteBtn.style.display = 'none';
	}
	}

	//object record of all the employees
	let recordCollection = {
		
	};

	//collect user records from input
	function userRecords(event) {
		event.preventDefault();
		let idNum = userID.value;
		let firstName = document.getElementById('firstName').value;
		let lastName = document.getElementById('lastName').value;
		let age = document.getElementById('age').value;
		let department = document.getElementById('department').value;
		let role = document.getElementById('jobRole').value;
		let level = document.getElementById('level').value;

		// generate employee id
		if (!idNum) { 

			//Ensure all data is provided for a new employee record
			if (!firstName || !lastName || !age || !department || !role || !level) {
				alert("For a new record, you must fill all the fields except ID");
				return false;
			} else {
				//Prevent duplicate user record adding
				let checkFirst;
				let checkLast;
				for (const id in recordCollection) {
				checkFirst = recordCollection[id]["First Name"];
				checkLast = recordCollection[id]["Last Name"];
				}
				
				if (checkFirst == firstName && checkLast == lastName) {
					alert(`The employee, ${firstName} ${lastName}, already exist.`);
					return false;
				} else {
					//Generate a four(4)-digit number id between 1000 to 9999 for the employee
					idNum = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;

					//add a new record to the record collections
					recordCollection[idNum] =  {
						"First Name": firstName,
						"Last Name": lastName,
						"Age": age,
						"Department": department,
						"Job Role": role,
						"Level": level
					};
					userTable(recordCollection);
					alert("Record Added Successfully");
				}
			}
			
		} else if (/^[0-9]+$/.test(idNum) === false) { 
		//checks if id is a number
			alert("ID must be a Number");
			return false;
		} else if (idNum.length !== 4) { 
		//checks if id is equal to 4 digits
			alert("ID must be four(4) numbers");
			return false;
		} else if (Object.keys(recordCollection).length !== 0 || Object.getPrototypeOf(recordCollection) !== Object.prototype) {
				//checks if the object is not empty

				if (!recordCollection.hasOwnProperty(idNum)) {
					//user ID not found
					alert(`Record for ID ${idNum} not found. Please verify the ID number and try again`);
					return false;
				} else {
					let confirmUpdate = confirm("Are you sure you want to update the user record?");
					if (confirmUpdate) {
						// User is found and the record will be updated
						// If any input field is empty, do not chanche that field on the record
						firstName =="" ? recordCollection[idNum]["First Name"] :recordCollection[idNum]["First Name"] = firstName;
						lastName =="" ? recordCollection[idNum]["Last Name"] :recordCollection[idNum]["Last Name"] = lastName;
						age =="" ? recordCollection[idNum]["Age"] :recordCollection[idNum]["Age"] = age;
						department =="" ? recordCollection[idNum]["Department"] :recordCollection[idNum]["Department"] = department;
						role =="" ? recordCollection[idNum]["Job Role"] :recordCollection[idNum]["Job Role"] = role;
						level =="" ? recordCollection[idNum]["Level"] :recordCollection[idNum]["Level"] = level;

						//return the user employee record table
						userTable(recordCollection);
						alert("Record Updated Successfully.");	
					} else {
						return false;
					}		
				};
		}else {
		//Record is empty
			alert("Empty employee record, nothing to search from");
			return false;
		};
	} 

	//Populates the output table using the data from the record collection
	function userTable(recordCollection) {
		let tBodyOld = document.querySelector('tBody');
		let tbodyNew = document.createElement('tBody');
		let serialNumberCounter = 1;

		for (const idNum in recordCollection) {
			let tRow = document.createElement('tr');
			let userId = document.createTextNode(idNum);
			let serialNumber = document.createTextNode("");
			let serialCol = document.createElement('td');
			let idCol = document.createElement('td');
			serialCol.appendChild(serialNumber);
			idCol.appendChild(userId);
			tRow.append(serialCol);
			tRow.append(idCol);

			//loop through the values in the supplied user Id and append each to table data
			let userData = recordCollection[idNum];
			for (const item in userData) {
				let data = document.createTextNode(userData[item]);
				let tData = document.createElement('td');
				tData.appendChild(data);
				tRow.append(tData);
			}
			tbodyNew.append(tRow);
		}

		
			
		tBodyOld.parentNode.replaceChild(tbodyNew, tBodyOld);

		//increment the s/n column for each data supplied
		let serialColumn = document.querySelector('tBody').children;
		for(const num of serialColumn) {
			num.firstChild.innerHTML = serialNumberCounter++;
		}

		//save record collection object to local storage
		window.localStorage.setItem("recordCollection", JSON.stringify(recordCollection));
	}

//delect employee data from the record
function deleteRecord(event) {
	event.preventDefault();
	let idNum = userID.value;
	
	if (!recordCollection.hasOwnProperty(idNum)) {
		alert(`No employee found with ID number ${idNum}`);
	} else {
		let firstName = recordCollection[idNum]["First Name"];
		let lastName = recordCollection[idNum]["Last Name"];
		let confirmDelete = confirm(`Are you sure you want to delete record of ${firstName} ${lastName}? This action is NOT reversible.`);
		if (confirmDelete) {
			delete recordCollection[idNum];
			userTable(recordCollection);
			alert("Employee record deleted Successfully");
		} else {
			return false;
		}
	}
}

function deleteAllRecords(event) {
	event.preventDefault();
	let confirmDeleteAll = confirm("Are you sure you want to delete all records? This Action is NOT reversible.");
	if (confirmDeleteAll) {
		recordCollection = {};
		userTable(recordCollection);
		//save record collection object to local storage
		window.localStorage.setItem("recordCollection", JSON.stringify(recordCollection));
	} else {
	return false;
	}
}
