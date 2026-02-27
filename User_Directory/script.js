const users = [
  {
    id: 1,
    name: "Aarav Sharma",
    username: "aarav123",
    email: "aarav@example.com",
    role: "Frontend Developer",
    bio: "Passionate about building beautiful and interactive UI experiences.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
    location: "Mumbai, India",
    followers: 1240
  },
  {
    id: 2,
    name: "Sophia Williams",
    username: "sophia_dev",
    email: "sophia@example.com",
    role: "UI/UX Designer",
    bio: "Designing user-centered digital experiences with creativity.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
    location: "New York, USA",
    followers: 980
  },
  {
    id: 3,
    name: "Liam Johnson",
    username: "liam_codes",
    email: "liam@example.com",
    role: "Backend Engineer",
    bio: "Loves APIs, databases, and scalable architectures.",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d",
    location: "London, UK",
    followers: 1560
  },
  {
    id: 4,
    name: "Emma Brown",
    username: "emma_creates",
    email: "emma@example.com",
    role: "Full Stack Developer",
    bio: "Building modern web apps with clean and efficient code.",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2",
    location: "Toronto, Canada",
    followers: 1120
  },
  {
    id: 5,
    name: "Noah Martinez",
    username: "noah_dev",
    email: "noah@example.com",
    role: "Mobile App Developer",
    bio: "Crafting seamless mobile experiences for Android and iOS.",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9",
    location: "Sydney, Australia",
    followers: 870
  }
];

const container = document.querySelector(".cardContainer");

function showUsers(arr) {
  container.innerHTML = ""; // clear old cards

  arr.forEach(function(user) {

    // Create card
    const card = document.createElement("div");
    card.classList.add("card");

    // Create image
    const img = document.createElement("img");
    img.src = user.image;
    img.classList.add("bg-img");

    // Create overlay
    const overlay = document.createElement("div");
    overlay.style.backgroundImage = `url(${user.image})`;
    overlay.classList.add("overlay");

    // Create content
    const content = document.createElement("div");
    content.classList.add("card-content");

    // Create heading
    const heading = document.createElement("h3");
    heading.textContent = user.name;

    // Create paragraph
    const para = document.createElement("p");
    para.textContent = user.bio;

    // Append text to content
    content.appendChild(heading);
    content.appendChild(para);

    // Append all to card
    card.appendChild(img);
    card.appendChild(overlay);
    card.appendChild(content);

    // Append card to container
    container.appendChild(card);
  });
}

showUsers(users);

let inp = document.querySelector(".inp");
inp.addEventListener("input", function() {
  let searchText = inp.value.toLowerCase();

  let newUsers = users.filter(user => {
    return user.name.toLowerCase().startsWith(searchText);
  });

  if(newUsers.length === 0) {
    container.innerHTML = "<p style= 'color: white'> No user found </p>";
  }
  else {
    showUsers(newUsers);
  }
});