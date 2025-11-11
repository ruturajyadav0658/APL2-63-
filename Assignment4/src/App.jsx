import "./App.css";

function App() {
  return (
    <>
      <div>
        <h2>Ruturaj vijay Yadav</h2>
        <hr />
      </div>
      <div>
        <p>D.Y.Patil College of Engineering & Technology</p>
        <p>
          Phone:+91 9322328920
          <span> &nbsp; &nbsp; &nbsp;Email:ruturajyadav50@gmail.com</span>
        </p>
      </div>
      <div>
        <h3>Education</h3>
        <hr />
        <p>Bachelor of Technology (B.Tech)-Computer Science and Engineering</p>
        <p>
          D.Y.Patil College of Engineering & Technology, Kolhapur, India
          (Currently Pursuing)
        </p>
      </div>
      <div>
        <h3>Projects</h3>
        <hr />
        <h3 className="project">Book Recommendation System </h3>
        <h4 className="skill">
          Key Skills : Python, Flask/Django, HTML, CSS, JavaScript, Database
          Management (MySQL/SQLite), File Handling
        </h4>
        <p>
          The Book Recommendation System using Collaborative Filtering is
          designed to suggest books to users based on their reading preferences
          and behavior. Collaborative Filtering works on the principle that
          users with similar interests in the past are likely to have similar
          preferences in the future. The system analyzes user-book interactions
          (such as ratings or likes) and uses similarity measures like cosine
          similarity or Pearson correlation to identify either similar users
          (user-based CF) or similar books (item-based CF). Based on these
          patterns, it predicts and recommends books that a user is most likely
          to enjoy, thus providing personalized and engaging suggestions, though
          it may face challenges like the cold start problem when new users or
          books are introduced
        </p>
      </div>
      <div>
        <h3  className="project">Farm-To-Market Website </h3>
        <h4 className="skill">Key Skills: HTML, CSS, JavaScript, PHP, and MySQL</h4>
        <p>
          The Farm-to-Market website is an online platform that bridges the gap
          between farmers and consumers by providing a digital marketplace for
          fresh agricultural products. Farmers can register and list their
          produce directly on the website, while consumers can browse, search,
          and purchase items such as fruits, vegetables, and grains without the
          involvement of middlemen. Built using HTML, CSS, JavaScript, PHP, and
          MySQL, the system includes essential features like user
          authentication, product management, shopping cart, order placement,
          and payment integration. This ensures farmers receive fair prices for
          their products while consumers gain access to fresh, affordable, and
          quality farm goods through a user-friendly and efficient platform.
        </p>
        <hr />
      </div>
<div>
  <h3>Skills & Interests </h3>
  <hr /> 
  <ul>
    <li>HTML</li>
    <li>CSS</li>
    <li>Javascript</li>
    <li>React</li>
  </ul>
</div>
    </>
  );
}

export default App;
