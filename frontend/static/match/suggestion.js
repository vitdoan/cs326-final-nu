import { getUserId, httpRequest } from "../utils.js";
import { createAvatar, fillOutHref } from "./match.js";

const suggestionList = document.getElementById("suggestionList");

onload = async () => {
	const userId = getUserId();

	await fillOutHref(userId);

	const { data, status } = await httpRequest(
		`/api/request/suggestion`,
		"POST",
		{ id: userId },
		[]
	);

	if (status === 200) {
		const suggestion = data;

		suggestion.forEach((value, index, array) => {
			const { username, description, id } = value;
			const listItem = document.createElement("li");
			listItem.classList.add("list-group-item");
			suggestionList.appendChild(listItem);

			const row = document.createElement("div");
			row.classList.add("row");
			listItem.appendChild(row);

			const col1 = document.createElement("div");
			col1.classList.add("col-md-3", "text-left");
			row.appendChild(col1);

			col1.appendChild(createAvatar(username));

			const col2 = document.createElement("div");
			col2.classList.add("col-md-5", "text-left", "align-self-center");
			row.appendChild(col2);

			const innerRow1 = document.createElement("div");
			innerRow1.classList.add("row", "pb-5");
			col2.appendChild(innerRow1);

			const col21 = document.createElement("div");
			col21.classList.add("col-auto", "text-md-left");
			innerRow1.appendChild(col21);

			const usernameNode = document.createElement("a");
			usernameNode.href = "#";
			usernameNode.appendChild(document.createTextNode(username));
			col21.appendChild(usernameNode);

			const innerRow2 = document.createElement("div");
			innerRow2.classList.add("row", "pt-3");
			col2.appendChild(innerRow2);

			const col22 = document.createElement("div");
			col22.classList.add("col-auto");
			innerRow2.appendChild(col22);

			const descriptionNode = document.createElement("p");
			descriptionNode.appendChild(document.createTextNode(description));
			col22.appendChild(descriptionNode);

			const col3 = document.createElement("div");
			col3.classList.add("col-md-auto", "align-self-center");
			row.appendChild(col3);

			const acceptBtn = document.createElement("button");
			acceptBtn.classList.add("btn", "btn-primary", "mr-1");
			acceptBtn.appendChild(document.createTextNode("Match"));
			col3.appendChild(acceptBtn);

			const declineBtn = document.createElement("button");
			declineBtn.classList.add("btn", "btn-secondary");
			declineBtn.appendChild(document.createTextNode("Pass"));
			col3.appendChild(declineBtn);

			acceptBtn.addEventListener("click", async (event) => {
				event.preventDefault();
				event.stopPropagation();

				const body = { sender: currentUser, receiver: id };
				const res = await httpRequest(`/api/request`, accessToken, "POST", body, []);
				if (res.status === 200) {
					col3.removeChild(acceptBtn);
					col3.removeChild(declineBtn);
				}
			});

			declineBtn.addEventListener("click", (event) => {
				col3.removeChild(acceptBtn);
				col3.removeChild(declineBtn);
			});
		});
	}
};
