import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css'; // Optional: if you want to style the homepage




function Home() {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-text">
          <h1 className="home-title">Welcome to FoodDRIVE</h1>
          <p className="home-description">
            A platform dedicated to increasing food donations by simplifying the process
            and connecting food banks, donors, and volunteer drivers.
          </p>
          <Link to="/dashboard">
            <button className="home-button">Get Started</button>
          </Link>
        </div>
      </div>




      {/* What is FoodDRIVE? Section */}
      <section className="about-section">
        <h2>What is FoodDRIVE?</h2>
        <p>
          FoodDRIVE is a social media platform designed to facilitate food donations in local communities.
          Our platform connects food banks in need with generous donors and volunteer drivers to help
          get food where it’s needed most. FoodDRIVE aims to make it easier than ever to contribute to the
          fight against hunger by simplifying the donation process and streamlining communication between all parties.
        </p>
        <p>
          By using FoodDRIVE, you can be part of a movement that works to ensure no one in your community
          goes hungry. Whether you're a food bank seeking specific items, a donor with extra food to give,
          or a volunteer driver helping make deliveries, everyone plays a vital role in making a difference.
        </p>
      </section>

      {/* Who We Are Section */}
      <section className="team-section">
        <h2>Who We Are</h2>
        <p className="normal_text">
          We are a passionate team of developers, designers, and community advocates who want to make an impact
          on food insecurity. The team behind FoodDRIVE includes:
        </p>
        <ul>
          <li><strong>Jason Beckmann</strong> - Full Stack Developer</li>
          <li><strong>Thomas Chappell</strong> - Backend Developer</li>
          <li><strong>Trent Wantman</strong> - Frontend Developer</li>
          <li><strong>Collin Whitney</strong> - UI/UX Designer</li>
        </ul>
        <p className="normal_text">
          We all share a common goal: to create a more connected and supportive community by ensuring that
          surplus food reaches the people who need it most.
        </p>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <h2>How It Works</h2>
        <div className="how-it-works">
          <div className="how-it-card">
            <h3>Donors</h3>
            <p>
              As a donor, you can post food items that you want to donate, along with key details like expiration
              dates, quantity, and weight. Your donation will be visible to nearby food banks and volunteer drivers.
            </p>
          </div>
          <div className="how-it-card">
            <h3>Food Banks</h3>
            <p>
              Food banks can post requests for specific items they need, along with the urgency and quantity. Volunteers
              and donors will be notified about your needs.
            </p>
          </div>
          <div className="how-it-card">
            <h3>Volunteer Drivers</h3>
            <p>
              Volunteer drivers can browse nearby donation requests and pick up food donations to deliver them to food
              banks in need. Our platform calculates estimated travel times to make the process as efficient as possible.
            </p>
          </div>
        </div>
      </section>



      {/* Our Mission Section */}
      <section className="mission-section">
        <h2>Our Mission</h2>
        <p className="normal_text">
          At FoodDRIVE, our mission is simple: to eliminate food waste, support local food banks, and help
          end hunger in communities. We strive to make food donations accessible to everyone, no matter how
          small the contribution. Our platform connects people who want to give with organizations in need,
          making the entire process seamless and efficient.
        </p>
        <p className="normal_text">
          Together, we can make a difference. Every meal donated helps someone in need, and every delivery
          made gets that meal closer to a hungry person. Join us in the movement to fight hunger, one meal at a time.
        </p>
      </section>




      {/* Call to Action Section */}
      <section className="cta-section">
        <h2>Join the FoodDRIVE Movement</h2>
        <p>
          Ready to help your community? Whether you’re a donor, food bank, or volunteer driver, there’s a role for you.
          Together, we can make a real impact on hunger in our communities.
        </p>
        <Link to="/dashboard">
          <button className="home-button">Get Started Now</button>
        </Link>
      </section>
    </div>
  );
}

export default Home;
