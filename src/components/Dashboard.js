import React, { useState, useEffect } from 'react';
import { MapPin, Calendar, Users, Search, Filter, Heart, MessageCircle, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const Dashboard = ({ user, trips }) => {
  const [filteredTrips, setFilteredTrips] = useState(trips);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('todas');
  const [showFavorites, setShowFavorites] = useState(false);

  const categories = [
    { value: 'todas', label: 'Todas', icon: '🌍' },
    { value: 'praia', label: 'Praia', icon: '🏖️' },
    { value: 'montanha', label: 'Montanha', icon: '⛰️' },
    { value: 'cidade', label: 'Cidade', icon: '🏙️' },
    { value: 'evento', label: 'Evento', icon: '🎉' },
    { value: 'natureza', label: 'Natureza', icon: '🌲' },
    { value: 'cultural', label: 'Cultural', icon: '🏛️' },
    { value: 'aventura', label: 'Aventura', icon: '🎢' },
    { value: 'gastronomico', label: 'Gastronômico', icon: '🍽️' }
  ];

  useEffect(() => {
    let filtered = trips;

    if (selectedCategory !== 'todas') {
      filtered = filtered.filter(trip => trip.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(trip => 
        trip.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trip.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trip.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (showFavorites) {
      const favorites = JSON.parse(localStorage.getItem('viajuntos_favorites') || '[]');
      filtered = filtered.filter(trip => favorites.includes(trip.id));
    }

    filtered.sort((a, b) => new Date(a.date) - new Date(b.date));

    setFilteredTrips(filtered);
  }, [trips, searchTerm, selectedCategory, showFavorites]);

  const toggleFavorite = (tripId) => {
    const favorites = JSON.parse(localStorage.getItem('viajuntos_favorites') || '[]');
    const index = favorites.indexOf(tripId);
    
    if (index > -1) {
      favorites.splice(index, 1);
    } else {
      favorites.push(tripId);
    }
    
    localStorage.setItem('viajuntos_favorites', JSON.stringify(favorites));
    setFilteredTrips([...filteredTrips]);
  };

  const isFavorite = (tripId) => {
    const favorites = JSON.parse(localStorage.getItem('viajuntos_favorites') || '[]');
    return favorites.includes(tripId);
  };

  const getCategoryIcon = (category) => {
    const cat = categories.find(c => c.value === category);
    return cat ? cat.icon : '🌍';
  };

  const isInterested = (trip) => {
    return trip.interested.some(person => person.id === user.id);
  };

  const isCreator = (trip) => {
    return trip.createdBy.id === user.id;
  };

  const isTripFull = (trip) => {
    return trip.interested.filter(p => p.accepted !== false).length >= trip.maxPeople;
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Olá, {user.name}! 👋
        </h1>
        <p className="text-lg text-gray-600">
          Encontre companhia para sua próxima aventura
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por destino, título ou descrição..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowFavorites(!showFavorites)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                showFavorites 
                  ? 'bg-red-100 text-red-700 border border-red-200' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Heart className={`w-4 h-4 inline mr-2 ${showFavorites ? 'fill-current' : ''}`} />
              Favoritos
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <label className="text-sm font-medium text-gray-700 self-center mr-2">
            <Filter className="w-4 h-4 inline mr-1" />
            Categoria:
          </label>
          {categories.map(category => (
            <button
              key={category.value}
              onClick={() => setSelectedCategory(category.value)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category.value
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.icon} {category.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTrips.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Nenhuma viagem encontrada
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || selectedCategory !== 'todas' || showFavorites
                ? 'Tente ajustar seus filtros'
                : 'Seja o primeiro a criar uma viagem!'
              }
            </p>
            {!searchTerm && selectedCategory === 'todas' && !showFavorites && (
              <Link
                to="/create"
                className="btn-primary inline-flex"
              >
                Criar Primeira Viagem
              </Link>
            )}
          </div>
        ) : (
          filteredTrips.map(trip => (
            <div key={trip.id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow card-hover">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{getCategoryIcon(trip.category)}</span>
                    <span className="text-sm text-gray-500 capitalize">{trip.category}</span>
                  </div>
                  <button
                    onClick={() => toggleFavorite(trip.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Heart className={`w-5 h-5 ${isFavorite(trip.id) ? 'fill-current text-red-500' : ''}`} />
                  </button>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {trip.title}
                </h3>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span className="text-sm">{trip.destination}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span className="text-sm">
                      {format(new Date(trip.date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Users className="w-4 h-4 mr-2" />
                    <span className="text-sm">
                      {trip.interested.filter(p => p.accepted !== false).length}/{trip.maxPeople} vagas
                    </span>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {trip.description}
                </p>

                <div className="flex items-center mb-4">
                  <img
                    src={trip.createdBy.avatar}
                    alt={trip.createdBy.name}
                    className="w-8 h-8 rounded-full mr-2"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{trip.createdBy.name}</p>
                    <p className="text-xs text-gray-500">{trip.createdBy.age} anos</p>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Link
                    to={`/trip/${trip.id}`}
                    className="flex-1 btn-primary text-center"
                  >
                    Ver Detalhes
                  </Link>
                  
                  {isCreator(trip) ? (
                    <Link
                      to={`/chat/${trip.id}`}
                      className="px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </Link>
                  ) : isInterested(trip) ? (
                    <div className="px-3 py-2 bg-green-100 text-green-700 rounded-lg">
                      <Users className="w-4 h-4" />
                    </div>
                  ) : isTripFull(trip) ? (
                    <div className="px-3 py-2 bg-gray-100 text-gray-500 rounded-lg cursor-not-allowed">
                      Lotado
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;
