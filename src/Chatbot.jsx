// Chatbot.jsx

import React, { useState, useEffect } from 'react';
import { Subject, of, timer, from} from 'rxjs';
import { map, switchMap, tap, catchError } from 'rxjs/operators';
import './Chatbot.css';
const fetch = require('node-fetch');

const questions = [
  { question: "What's your name?", answer: "I'm E-Vartalap, your friendly chatbot!" },
  { question: "What is RxJS?", answer: "RxJS is a library for reactive programming in JavaScript." },
  { question: "Do you have a favorite color?", answer: "As a large language model, I don't have personal preferences like colors." },
  //{ question: "What is the weather like today?", answer: "I'm fetching weather data. Please wait a moment..." },
  { question: "What is your favorite film?", answer: "I can't say I have favorites, but I can tell you about them." },
  //{ question: "Tell me a joke.", answer: "Why did the scarecrow win an award? Because he was outstanding in his field!" },
];

const jokes = [
  // General Jokes
  "Why don't skeletons fight each other? They don't have the guts.",
  "I told my wife she was drawing her eyebrows too high. She looked surprised.",
  "Parallel lines have so much in common. It's a shame they'll never meet.",
  "What do you call fake spaghetti? An impasta.",
  "I'm reading a book on anti-gravity. It's impossible to put down!",
  "What do you get when you cross a snowman and a vampire? Frostbite!",
  "I used to be a baker, but I couldn't make enough dough.",
  "Why did the bicycle fall over? Because it was two-tired!",
  "Did you hear about the mathematician who's afraid of negative numbers? He'll stop at nothing to avoid them.",
  "I told my computer I needed a break. Now it won't stop sending me vacation ads!",
  
  // Animal Jokes
  "Why did the duck go to rehab? Because he was a quack addict.",
  "What do you get when you cross a snowman and a dog? Frostbite!",
  "Why did the cow become an artist? It wanted to draw some moosic.",
  "What do you call a fish wearing a bowtie? Sofishticated.",
  "Why don't sharks like fast food? Because they can't catch it!",
  "What's a frog's favorite candy? Lollihops.",
  "Why did the chicken join a band? Because it had the drumsticks!",
  "What's a cow's favorite day of the week? Mooonday.",
  "What do you call a bear with no teeth? A gummy bear.",
  "Why don't seagulls fly over the bay? Because then they'd be bagels!",
  
  // Science Jokes
  "Why did the atom cross the road? To get to the other side of the nucleus.",
  "What's the chemical formula for banana? BaNa2.",
  "Why was the math book sad? It had too many problems.",
  "What's a physicist's favorite food? Fission chips.",
  "Why did the biologist go to art school? He wanted to learn how to draw blood.",
  "Why did the white blood cell go to school? It wanted to be cultured.",
  "Why do plants hate math? Because it gives them square roots.",
  "Why did the math book look sad? Because it had too many problems.",
  "Why did the bicycle fall over? Because it was two-tired!",
  "Why did the computer go to therapy? It had too many bytes.",
  
  // Food Jokes
  "Why did the tomato turn red? Because it saw the salad dressing!",
  "What do you call cheese that isn't yours? Nacho cheese!",
  "Why did the cookie go to the doctor? Because it was feeling crumbly!",
  "Why did the coffee file a police report? It got mugged.",
  "What's a vampire's favorite fruit? A necktarine.",
  "Why did the orange stop rolling down the hill? It ran out of juice!",
  "Why did the lettuce win the race? Because it was ahead.",
  "What did one plate say to the other plate? Dinner's on me!",
  "Why did the banana go to the doctor? Because it wasn't peeling well!",
  "What did the sushi say to the bee? Wasabi!",
  
  // Tech Jokes
  "Why did the computer go to therapy? It had too many bytes.",
  "Why did the smartphone go to school? It wanted to be smart.",
  "Why don't programmers like nature? It has too many bugs.",
  "Why did the WiFi break up with its router? It had too many dropped connections.",
  "What do you call a computer that sings? A-Dell.",
  "Why did the computer keep freezing? It left its Windows open.",
  "Why was the JavaScript developer sad? Because he didn't know how to console himself.",
  "Why did the smartphone bring a charger to the party? It didn't want to run out of juice!",
  "Why was the IT guy always calm? He had a lot of cache.",
  "Why did the robot go on a diet? It had too many bytes.",
  
  // Dad Jokes
  "Why don't eggs tell jokes? They'd crack each other up.",
  "What did the janitor say when he jumped out of the closet? 'Supplies!'",
  "Why did the scarecrow win an award? Because he was outstanding in his field!",
  "What's brown and sticky? A stick.",
  "Why did the golfer bring two pairs of pants? In case he got a hole in one.",
  "Why did the tomato turn red? Because it saw the salad dressing.",
  "What do you call fake spaghetti? An impasta.",
  "Why don't skeletons fight each other? They don't have the guts.",
  "What do you call a factory that makes okay products? A satisfactory.",
  "Why don't scientists trust atoms? Because they make up everything!"
];

const getRandomJoke = () => {
  const randomIndex = Math.floor(Math.random() * jokes.length);
  return jokes[randomIndex];
  
};

const userInput$ = new Subject();
const exitKeyword = 'exit';

const chatbotResponse$ = userInput$.pipe(
  map((userInput) => userInput.toLowerCase()),
  switchMap((question) => {
    if (question === exitKeyword) {
      return of('Goodbye! See you next time.'); // Exit message
    }
    if (question === 'hi'|| question === 'Hello' || question === 'hello' || question === 'Hi') {
      return of("Hi! Good to see you. How can I help you?");}
    if (question.includes("weather")) {
      const cityNameRegex = /(?:weather\s*(?:in|for)?\s*)(\w+(?:\s*\w+)*)/i;
      const match = question.match(cityNameRegex);
      let cityName = match ? match[1].trim() : null;
      
      if (!cityName) {
        return of("I'm sorry, I couldn't understand the city name. Please try again.");
      } 
      cityName = cityName.replace(/\b\w/g, char => char.toUpperCase());
      const url = `https://weather-api138.p.rapidapi.com/weather?city_name=${cityName}`;
      
      const options = {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': '6d4e1d80a3mshbab23a1b4bbfc73p121095jsnb6a0d398ffb0',
          'X-RapidAPI-Host': 'weather-api138.p.rapidapi.com'
        }
      };
      return from(fetch(url, options)).pipe(
        switchMap(response => {
          if (!response.ok) {
            throw new Error('Failed to fetch weather data');
          }
          return from(response.json());
        }),
        map(weatherData => {
          // Extract relevant information from weatherData
          const weatherDescription = weatherData && weatherData.weather && weatherData.weather[0] && weatherData.weather[0].description;
          const temperature = weatherData && weatherData.main && weatherData.main.temp;
          const humidity = weatherData && weatherData.main && weatherData.main.humidity;
          return (
            <div>
              <p>The weather in {cityName} is currently {weatherDescription} :</p>
              <ul>
                <li>Temperature: {(temperature - 273.5).toFixed(2)}°C</li>
                <li>Humidity: {humidity}%</li>
              </ul>
            </div>
          );
        }),
        catchError(error => {
          console.error('Error fetching weather data:', error);
          return of('Failed to fetch weather data. Please try again later.');
        })
      );
    }
    if (question.includes("music")) {
      const trackNameRegex = /(?:music\s*(?:of|by)?\s*)(.+)/i;
      const match = question.match(trackNameRegex);
      let trackName = match ? match[1].trim() : null;

      if (!trackName) {
        return of("I'm sorry, I couldn't understand the track name. Please try again.");
      }

      const searchQuery = encodeURIComponent(trackName);
      const url = `https://shazam-api6.p.rapidapi.com/shazam/search_track/?query=${searchQuery}&limit=3`;

      const options = {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': '6d4e1d80a3mshbab23a1b4bbfc73p121095jsnb6a0d398ffb0',
          'X-RapidAPI-Host': 'shazam-api6.p.rapidapi.com'
        }
      };

      return from(fetch(url, options)).pipe(
        switchMap(response => {
          if (!response.ok) {
            throw new Error('Failed to fetch music data');
          }
          return from(response.json());
        }),
        map(musicData => {
          const tracks = musicData.result.tracks.hits;
          if (tracks.length === 0) {
            return "Sorry, I couldn't find any tracks matching your query.";
          }

// Inside the map function where you format the music results
          const formattedResults = tracks.map((track, index) => {
            const title = track.heading.title;
            const artist = track.artists.map(artist => artist.alias).join(', ');

            return (
              <li key={title}>
                <strong>Title:</strong> {title}<br />
                <strong>Artist(s):</strong> {artist}<br />
              </li>
            );
          });

          // Wrap the formattedResults in a <ul> element
          return (
            <ul>{formattedResults}</ul>
          );

      }),
        catchError(error => {
          console.error('Error fetching music data:', error);
          return of('Failed to fetch music data. Please try again later.');
        })
      );
    }

    if (question.includes("movie")) {
      const movieNameRegex = /(?:movie\s*(?:of|about)?\s*)(.+)/i;
      const match = question.match(movieNameRegex);
      const movieName = match ? match[1].trim() : null;

      if (!movieName) {
        return of("I'm sorry, I couldn't understand the movie name. Please try again.");
      }

      const movieUrl = `https://imdb146.p.rapidapi.com/v1/find/?query=${encodeURIComponent(movieName)}`;
      const movieOptions = {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': '6d4e1d80a3mshbab23a1b4bbfc73p121095jsnb6a0d398ffb0',
          'X-RapidAPI-Host': 'imdb146.p.rapidapi.com'
        }
      };

      return from(fetch(movieUrl, movieOptions)).pipe(
        switchMap(response => {
          if (!response.ok) {
            throw new Error('Failed to fetch movie data');
          }
          return from(response.json());
        }),
        map(movieData => {
          const titleResults = movieData.titleResults.results;
          if (!titleResults || titleResults.length === 0) {
            return "Sorry, I couldn't find any movies matching your query.";
          }

          // Extracting data for the top 5 movies
          const topMovies = titleResults.slice(0, 5);
// Inside the map function where you format the movie results
            const formattedResults = topMovies.map(movie => {
            const titleName = movie.titleNameText;
            const releaseYear = movie.titleReleaseText;
            return (
              <li key={titleName}>
                <strong>Title:</strong> {titleName}<br />
                <strong>Year:</strong> {releaseYear}<br />
              </li>
            );
          });

// Wrap the formattedResults in a <ul> element
          return (
            <ul>{formattedResults}</ul>
          );

        }),
        catchError(error => {
          console.error('Error fetching movie data:', error);
          return of('Failed to fetch movie data. Please try again later.');
        })
      );
    }
    if (question.includes("joke")) {
      return timer(1000).pipe(
        map(() => getRandomJoke())
      );
    }
    const answer = questions.find((qa) => qa.question.toLowerCase() === question)?.answer;
    if (answer) {
      return timer(2000).pipe(map(() => answer));
    } else {
      return timer(1000).pipe(
        switchMap(() => {
          return of("I'm still learning, but I don't quite understand that question yet. Can I help you with something else?");
        })
      );
    }
  }),
  tap((response) => {
    if (response !== 'Goodbye! See you next time.') {
      // Simulate typing delay before prompting again
      setTimeout(() => {
        console.log('Prompting user for input...');
      }, 1500);
    }
  }),
  catchError((error) => {
    console.error('An unexpected error occurred:', error);
    return of('An unexpected error occurred. Please try again or type "exit" to quit.'); // Error message
  })
);

function Chatbot() {
  const [userInput, setUserInput] = useState("");
  const [conversation, setConversation] = useState([]);

  useEffect(() => {
    setConversation([
      { chatbot: "Welcome to E-VARTALAP! I'm here to assist you with various topics." },
      { chatbot: "Feel free to ask me about jokes, weather, music, or movies and I will do my best to help!!" }
    ]);
    const userInputSubscription = userInput$.subscribe((userInput) => {
      setUserInput("");
      setConversation(prevConversation => [...prevConversation, { you: userInput }]);
      if (userInput.toLowerCase() === 'exit') {
        setTimeout(() => {
          setConversation([
            { chatbot: "Welcome to E-VARTALAP! I'm here to assist you with various topics." },
            { chatbot: "Feel free to ask me about jokes, weather, music, or movies and I will do my best to help!!" }
          ]);
        }, 2000); // Delay to display goodbye message before resetting
      }
    });

    const responseSubscription = chatbotResponse$.subscribe((response) => {
      setConversation(prevConversation => [...prevConversation, { chatbot: response }]);
    });

    return () => {
      userInputSubscription.unsubscribe();
      responseSubscription.unsubscribe();
    };
  }, []);

  const handleUserInput = (event) => {
    setUserInput(event.target.value);
  };

  const sendMessage = () => {
    if (userInput.trim()) {
      userInput$.next(userInput.trim());
    }
  };

  return (
    <div className="chatbot-fixed-container">
      <h1 className="heading">E-VARTALAP</h1>
      <ul className="message-container">
        {conversation.map((message, index) => (
          <li key={index} className={`message-item ${message.you ? 'user-message' : 'chatbot-message'}`}>
            {message.you || message.chatbot}
            {message.you && <span className="user-name">You</span>}
            {message.chatbot && <span className="chatbot-name">Chatbot</span>}
          </li>
        ))}
      </ul>
      <div className="input-container">
        <input type="text" value={userInput} onChange={handleUserInput} className="message-input" />
        <button onClick={sendMessage} className="send-button">Send</button>
      </div>
    </div>
  );
}

export default Chatbot;

