function itemTemplate(item){

	return `<li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
				<span class="item-text">${item.text}</span>
				<div>
					<button data-id="${item._id}" class="edit-me btn btn-secondary btn-sm mr-1">Edit</button>
					<button data-id="${item._id}" class="delete-me btn btn-danger btn-sm">Delete</button>
				</div>
			</li>`;

}

//Initial Page Load Render
let ourHTML = items.map(function(item){
	return itemTemplate(item);
}).join('');
document.getElementById('item-list').insertAdjacentHTML('beforeend', ourHTML);

//Create function
document.getElementById('create-form').addEventListener('submit',function(e){
	e.preventDefault();e.stopPropagation();
	const createField = document.getElementById('create-field');
	if (createField.value !== '') {
		console.log('post');
		axios.post('/create-item',{text:createField.value}).then(function(res){
			//insert new item
			const list = document.getElementById('item-list');
			list.insertAdjacentHTML("beforeend",itemTemplate(res.data));
			createField.value="";
			createField.focus();
		}).catch(function(){
			console.log("Please try again later.");
		});
	}else{
		alert("Please type something.");
	}
});

document.addEventListener('click',function(e){

	//Delete function
	if(e.target.classList.contains("delete-me")){
		let id = e.target.getAttribute('data-id');
		if(confirm("Do you really want to delete this item permenantly?")){
			axios.post('/delete-item',{id:id}).then(function(){
				//remove item
				e.target.parentElement.parentElement.remove();
			}).catch(function(){
				console.log("Please try again later.");
			});
		}
	}

	//Update function
	if(e.target.classList.contains("edit-me")){
		let userInput = prompt("Enter your desired new text",e.target.parentElement.parentElement.querySelector('.item-text').innerHTML);
		let id = e.target.getAttribute('data-id');
		if(userInput){
			axios.post('/update-item',{text:userInput,id:id}).then(function(){
				//update text
				e.target.parentElement.parentElement.querySelector('.item-text').innerHTML = userInput;
			}).catch(function(){
				console.log("Please try again later.");
			});
		}
	}
});