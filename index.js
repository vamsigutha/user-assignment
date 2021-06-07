var submit = document.getElementById("submit");
var userId = document.getElementById("userId");
var displayResult = document.querySelector(".displayResult");
var KEY = "lXDGBrzVFU8EWxYtXNtYWCotQk1u7KFV";

submit.addEventListener("click", () => {
  displayResult.innerHTML = "Loading...";
  getUserDetails(userId.value);
});

//get user details by id
getUserDetails = async (userId) => {
  let path = "https://jsonplaceholder.typicode.com/users/" + userId;
  let userDetails = await axios.get(path).then((res) => {
    var result = res.data;
    console.log(result);
    return result;
  });
  let location = await getLocation(
    userDetails.address.geo.lat,
    userDetails.address.geo.lng
  );

  displayResult.innerHTML = `<p>User Name: ${userDetails.name}</p>
    <p>Email: ${userDetails.email}</p>
    <p>Address: ${userDetails.address.suite}, ${userDetails.address.street},${userDetails.address.city} - ${userDetails.address.zipcode}</p>
    <p>Location: ${location}
    <p><button class="showPosts">Get Posts</button></p>
    `;
  var getPosts = document.querySelector(".showPosts");
  getPosts.addEventListener("click", async () => {
    await onShowPostsButtonClick(userId);
  });
};

//to create posts
onShowPostsButtonClick = async (userId) => {
  var posts = await fetchPostsByUser(userId);
  var div = document.createElement("div");
  var body = document.getElementsByTagName("body")[0];
  body.appendChild(div);
  for (let i = 0; i < posts.length; i++) {
    var postDiv = document.createElement("div");
    var tag = document.createElement("p");
    var text = document.createTextNode(posts[i].title);
    var titleText = document.createTextNode("Title:");
    tag.appendChild(titleText);
    tag.appendChild(text);

    var postBodyTag = document.createElement("p");
    var bodyText = document.createTextNode("Body:");
    var postBodyText = document.createTextNode(posts[i].title);
    postBodyTag.appendChild(bodyText);
    postBodyTag.appendChild(postBodyText);

    var showCommentsButtonTag = document.createElement("button");
    showCommentsButtonTag.innerHTML = "show comments";
    showCommentsButtonTag.id = posts[i].id;

    postDiv.appendChild(tag);
    postDiv.appendChild(postBodyTag);
    postDiv.appendChild(showCommentsButtonTag);

    showCommentsButtonTag.addEventListener("click", async (e) => {
      await onClickShowCommentsButton(e);
    });

    div.appendChild(postDiv);
  }
};

//creates comments
onClickShowCommentsButton = async (e) => {
  var showCommentsDivTag = document.createElement("div");
  var parentElement = e.target.parentElement;
  var comments = await getCommentsByPost(e.target.id);
  var commentText = ``;

  for (let i = 0; i < comments.length; i++) {
    commentText += `<p>Name: ${comments[i].name}</p>
          <p>Email: ${comments[i].email}</p>
          <p>Body: ${comments[i].body}</p>`;
  }

  showCommentsDivTag.innerHTML = commentText;
  showCommentsDivTag.classList.add("comment");
  parentElement.appendChild(showCommentsDivTag);
};

//get posts by user id
fetchPostsByUser = async (userId) => {
  let path = `https://jsonplaceholder.typicode.com/users/${userId}/posts`;
  return await axios.get(path).then((res) => {
    console.log(res.data);
    return res.data;
  });
};

//get comments by post id
getCommentsByPost = async (postId) => {
  let path = `https://jsonplaceholder.typicode.com/posts/${postId}/comments`;
  return await axios.get(path).then((res) => {
    console.log(res.data);
    return res.data;
  });
};

//get location with lat and long coordinates
getLocation = async (lat, long) => {
  let path = `https://www.mapquestapi.com/geocoding/v1/reverse?key=${KEY}&location=${lat},${long}&includeRoadMetadata=true&includeNearestIntersection=true`;

  var location = await axios.get(path).then((res) => {
    var result = res.data.results[0].locations[0];
    var loc = `${result.street}, ${result.adminArea6},${result.adminArea5},${result.adminArea4},${result.adminArea3},${result.adminArea1} - ${result.postalCode},`;
    console.log(res.data.results[0].locations[0]);
    return loc;
  });
  console.log(location);
  return location;
};
