import React, { useState } from 'react';
import { MapPin, Calendar, Users, Tag, ArrowLeft, MessageCircle, Check, X, Heart, Share2 } from 'lucide-react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const TripDetails = ({ trips, user, onJoinTrip, onLeaveTrip, onAcceptInterested }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showAllInterested, setShowAllInterested] = useState(false);

  const trip = trips.find(t => t.id === parseInt(id));

  if (!trip) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <h3 className="text-xl font-semibold text-gray-600 mb-4">
            Viagem não encontrada
          </h3>
          <button
            onClick={() => navigate('/dashboard')}
            className="btn-primary"
          >
            Voltar para o Início
          </button>
        </div>
      </div>
    );
  }

  const getCategoryIcon = (category) => {
    const icons = {
      praia: '🏖️',
      montanha: '⛰️',
      cidade: '🏙️',
      evento: '🎉',
      natureza: '🌲',
      cultural: '🏛️',
      aventura: '🎢',
      gastronomico: '🍽️'
    };
    return icons[category] || '🌍';
  };

  const isCreator = trip.createdBy.id === user.id;
  const isInterested = trip.interested.some(person => person.id === user.id);
  const isAccepted = trip.interested.find(person => person.id === user.id)?.accepted;
  const isTripFull = trip.interested.filter(p => p.accepted !== false).length >= trip.maxPeople;

  const handleJoinLeave = () => {
    if (isInterested) {
      onLeaveTrip(trip.id);
    } else {
      onJoinTrip(trip.id);
    }
  };

  const handleAcceptUser = (userId) => {
    onAcceptInterested(trip.id, userId);
  };

  const handleRejectUser = (userId) => {
    const updatedTrips = trips.map(t => {
      if (t.id === trip.id) {
        return {
          ...t,
          interested: t.interested.filter(p => p.id !== userId)
        };
      }
      return t;
    });
    localStorage.setItem('viajuntos_trips', JSON.stringify(updatedTrips));
  };

  const toggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem('viajuntos_favorites') || '[]');
    const index = favorites.indexOf(trip.id);
    
    if (index > -1) {
      favorites.splice(index, 1);
    } else {
      favorites.push(trip.id);
    }
    
    localStorage.setItem('viajuntos_favorites', JSON.stringify(favorites));
  };

  const isFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem('viajuntos_favorites') || '[]');
    return favorites.includes(trip.id);
  };

  const shareTrip = () => {
    if (navigator.share) {
      navigator.share({
        title: trip.title,
        text: `Vou para ${trip.destination}! Alguém quer ir junto?`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copiado para a área de transferência!');
    }
  };

  const pendingInterested = trip.interested.filter(person => !person.accepted && person.accepted !== false);
  const acceptedInterested = trip.interested.filter(person => person.accepted !== false);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Voltar</span>
      </button>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white p-6">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-3">
                <span className="text-3xl">{getCategoryIcon(trip.category)}</span>
                <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
                  {trip.category}
                </span>
              </div>
              <h1 className="text-3xl font-bold mb-2">{trip.title}</h1>
              <div className="space-y-2 text-primary-100">
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  <span className="text-lg">{trip.destination}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  <span className="text-lg">
                    {format(new Date(trip.date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                  </span>
                </div>
                <div className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  <span className="text-lg">
                    {acceptedInterested.length + 1}/{trip.maxPeople} vagas preenchidas
                  </span>
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={toggleFavorite}
                className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                title={isFavorite() ? "Remover dos favoritos" : "Adicionar aos favoritos"}
              >
                <Heart className={`w-5 h-5 ${isFavorite() ? 'fill-current' : ''}`} />
              </button>
              <button
                onClick={shareTrip}
                className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                title="Compartilhar viagem"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Sobre a viagem</h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {trip.description}
            </p>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Organizador</h2>
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <img
                src={trip.createdBy.avatar}
                alt={trip.createdBy.name}
                className="w-16 h-16 rounded-full"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{trip.createdBy.name}</h3>
                <p className="text-gray-600">{trip.createdBy.age} anos</p>
                {trip.createdBy.bio && (
                  <p className="text-sm text-gray-500 mt-1">{trip.createdBy.bio}</p>
                )}
              </div>
            </div>
          </div>

          {isCreator && pendingInterested.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                Solicitações de Participação ({pendingInterested.length})
              </h2>
              <div className="space-y-3">
                {pendingInterested.map(person => (
                  <div key={person.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <img
                        src={person.avatar}
                        alt={person.name}
                        className="w-12 h-12 rounded-full"
                      />
                      <div>
                        <h4 className="font-medium text-gray-900">{person.name}</h4>
                        <p className="text-sm text-gray-600">{person.age} anos</p>
                        {person.bio && (
                          <p className="text-sm text-gray-500 mt-1">{person.bio}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleAcceptUser(person.id)}
                        className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                        title="Aceitar"
                      >
                        <Check className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleRejectUser(person.id)}
                        className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                        title="Rejeitar"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {acceptedInterested.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                Participantes Confirmados ({acceptedInterested.length + 1})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <img
                    src={trip.createdBy.avatar}
                    alt={trip.createdBy.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <h4 className="font-medium text-gray-900">{trip.createdBy.name}</h4>
                    <p className="text-sm text-gray-600">Organizador</p>
                  </div>
                </div>
                {acceptedInterested.map(person => (
                  <div key={person.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <img
                      src={person.avatar}
                      alt={person.name}
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <h4 className="font-medium text-gray-900">{person.name}</h4>
                      <p className="text-sm text-gray-600">{person.age} anos</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex space-x-4">
            {!isCreator && (
              <>
                {isInterested ? (
                  isAccepted ? (
                    <>
                      <Link
                        to={`/chat/${trip.id}`}
                        className="flex-1 btn-primary text-center flex items-center justify-center"
                      >
                        <MessageCircle className="w-5 h-5 mr-2" />
                        Acessar Chat
                      </Link>
                      <button
                        onClick={handleJoinLeave}
                        className="btn-secondary"
                      >
                        Sair da Viagem
                      </button>
                    </>
                  ) : (
                    <div className="flex-1 bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg text-center">
                      Aguardando aprovação do organizador
                    </div>
                  )
                ) : isTripFull ? (
                  <div className="flex-1 bg-gray-50 border border-gray-200 text-gray-500 px-4 py-3 rounded-lg text-center">
                    Viagem Lotada
                  </div>
                ) : (
                  <button
                    onClick={handleJoinLeave}
                    className="flex-1 btn-primary text-lg"
                  >
                    Participar desta Viagem
                  </button>
                )}
              </>
            )}
            
            {isCreator && (
              <Link
                to={`/chat/${trip.id}`}
                className="flex-1 btn-primary text-center flex items-center justify-center"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Gerenciar Chat
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripDetails;
