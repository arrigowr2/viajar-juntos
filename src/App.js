import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { User, MapPin, Calendar, MessageCircle, Home, PlusCircle, Search, UserCircle } from 'lucide-react';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import CreateTrip from './components/CreateTrip';
import TripList from './components/TripList';
import TripDetails from './components/TripDetails';
import Chat from './components/Chat';
import Profile from './components/Profile';
import './index.css';

function App() {
  const [user, setUser] = useState(null);
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    const savedUser = localStorage.getItem('viajuntos_user');
    const savedTrips = localStorage.getItem('viajuntos_trips');
    
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    
    if (savedTrips) {
      setTrips(JSON.parse(savedTrips));
    } else {
      const sampleTrips = [
        {
          id: 1,
          title: "Viagem para a Praia do Rosa",
          destination: "Praia do Rosa, SC",
          date: "2024-02-15",
          description: "Buscando companhia para uma viagem relaxante para uma das praias mais bonitas de Santa Catarina. Vamos curtir o sol, a natureza e fazer novas amizades!",
          category: "praia",
          createdBy: {
            id: 1,
            name: "Ana Silva",
            age: 28,
            bio: "Amante de viagens e novas experiências",
            avatar: "https://picsum.photos/seed/ana/100/100"
          },
          interested: [],
          maxPeople: 3,
          status: "active"
        },
        {
          id: 2,
          title: "Caminhada na Serra da Mantiqueira",
          destination: "Monte Verde, MG",
          date: "2024-02-20",
          description: "Planejando uma trilha incrível na serra. Quem topa curtir a natureza e o ar puro? Nível intermediário.",
          category: "montanha",
          createdBy: {
            id: 2,
            name: "Carlos Mendes",
            age: 32,
            bio: "Aventureiro e fotógrafo amador",
            avatar: "https://picsum.photos/seed/carlos/100/100"
          },
          interested: [],
          maxPeople: 4,
          status: "active"
        },
        {
          id: 3,
          title: "Festival de Música em Salvador",
          destination: "Salvador, BA",
          date: "2024-03-01",
          description: "Vou para o festival e gostaria de companhia para dividir custos e aproveitar ainda mais! Tem shows incríveis confirmados.",
          category: "evento",
          createdBy: {
            id: 3,
            name: "Mariana Costa",
            age: 25,
            bio: "Música é minha paixão",
            avatar: "https://picsum.photos/seed/mariana/100/100"
          },
          interested: [],
          maxPeople: 2,
          status: "active"
        }
      ];
      setTrips(sampleTrips);
      localStorage.setItem('viajuntos_trips', JSON.stringify(sampleTrips));
    }
  }, []);

  useEffect(() => {
    if (trips.length > 0) {
      localStorage.setItem('viajuntos_trips', JSON.stringify(trips));
    }
  }, [trips]);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('viajuntos_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('viajuntos_user');
  };

  const handleCreateTrip = (tripData) => {
    const newTrip = {
      ...tripData,
      id: Date.now(),
      createdBy: user,
      interested: [],
      status: "active"
    };
    setTrips([...trips, newTrip]);
  };

  const handleJoinTrip = (tripId) => {
    setTrips(trips.map(trip => {
      if (trip.id === tripId && !trip.interested.find(p => p.id === user.id)) {
        return {
          ...trip,
          interested: [...trip.interested, user]
        };
      }
      return trip;
    }));
  };

  const handleLeaveTrip = (tripId) => {
    setTrips(trips.map(trip => {
      if (trip.id === tripId) {
        return {
          ...trip,
          interested: trip.interested.filter(p => p.id !== user.id)
        };
      }
      return trip;
    }));
  };

  const handleAcceptInterested = (tripId, interestedUserId) => {
    setTrips(trips.map(trip => {
      if (trip.id === tripId && trip.createdBy.id === user.id) {
        return {
          ...trip,
          interested: trip.interested.map(person => 
            person.id === interestedUserId 
              ? { ...person, accepted: true }
              : person
          )
        };
      }
      return trip;
    }));
  };

  const cleanExpiredTrips = () => {
    const today = new Date();
    setTrips(trips.filter(trip => new Date(trip.date) >= today));
  };

  useEffect(() => {
    cleanExpiredTrips();
    const interval = setInterval(cleanExpiredTrips, 60000);
    return () => clearInterval(interval);
  }, []);

  if (!user) {
    return (
      <Router>
        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register onLogin={handleLogin} />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-8">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-8 h-8 text-primary-600" />
                  <span className="text-xl font-bold text-gray-900">ViaJuntos</span>
                </div>
                <div className="hidden md:flex space-x-6">
                  <a href="/dashboard" className="text-gray-700 hover:text-primary-600 transition-colors flex items-center space-x-1">
                    <Home className="w-4 h-4" />
                    <span>Início</span>
                  </a>
                  <a href="/trips" className="text-gray-700 hover:text-primary-600 transition-colors flex items-center space-x-1">
                    <Search className="w-4 h-4" />
                    <span>Buscar</span>
                  </a>
                  <a href="/create" className="text-gray-700 hover:text-primary-600 transition-colors flex items-center space-x-1">
                    <PlusCircle className="w-4 h-4" />
                    <span>Criar Viagem</span>
                  </a>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <a href="/profile" className="text-gray-700 hover:text-primary-600 transition-colors flex items-center space-x-1">
                  <UserCircle className="w-6 h-6" />
                  <span className="hidden md:block">{user.name}</span>
                </a>
                <button 
                  onClick={handleLogout}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Sair
                </button>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/dashboard" element={<Dashboard user={user} trips={trips} />} />
            <Route path="/trips" element={<TripList trips={trips} user={user} onJoinTrip={handleJoinTrip} onLeaveTrip={handleLeaveTrip} />} />
            <Route path="/create" element={<CreateTrip user={user} onCreateTrip={handleCreateTrip} />} />
            <Route path="/trip/:id" element={<TripDetails trips={trips} user={user} onJoinTrip={handleJoinTrip} onLeaveTrip={handleLeaveTrip} onAcceptInterested={handleAcceptInterested} />} />
            <Route path="/chat/:tripId" element={<Chat user={user} trips={trips} />} />
            <Route path="/profile" element={<Profile user={user} />} />
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
        </main>

        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
          <div className="flex justify-around py-2">
            <a href="/dashboard" className="flex flex-col items-center p-2 text-gray-700">
              <Home className="w-6 h-6" />
              <span className="text-xs mt-1">Início</span>
            </a>
            <a href="/trips" className="flex flex-col items-center p-2 text-gray-700">
              <Search className="w-6 h-6" />
              <span className="text-xs mt-1">Buscar</span>
            </a>
            <a href="/create" className="flex flex-col items-center p-2 text-gray-700">
              <PlusCircle className="w-6 h-6" />
              <span className="text-xs mt-1">Criar</span>
            </a>
            <a href="/profile" className="flex flex-col items-center p-2 text-gray-700">
              <UserCircle className="w-6 h-6" />
              <span className="text-xs mt-1">Perfil</span>
            </a>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
