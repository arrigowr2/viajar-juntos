import React, { useState, useEffect } from 'react';
import { Mail, MapPin, Edit2, LogOut, ArrowLeft, MessageCircle, Users } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Profile = ({ user }) => {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({ ...user });

  useEffect(() => {
    const savedTrips = JSON.parse(localStorage.getItem('viajuntos_trips') || '[]');
    setTrips(savedTrips);
  }, []);

  const handleSaveProfile = () => {
    const users = JSON.parse(localStorage.getItem('viajuntos_users') || '[]');
    const userIndex = users.findIndex(u => u.id === user.id);
    
    if (userIndex > -1) {
      users[userIndex] = editedUser;
      localStorage.setItem('viajuntos_users', JSON.stringify(users));
      localStorage.setItem('viajuntos_user', JSON.stringify(editedUser));
      
      window.location.reload();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('viajuntos_user');
    navigate('/login');
  };

  const myTrips = trips.filter(trip => trip.createdBy.id === user.id);
  const participatingTrips = trips.filter(trip => 
    trip.interested.some(person => person.id === user.id) && trip.createdBy.id !== user.id
  );

  const getStats = () => {
    const totalTrips = myTrips.length + participatingTrips.length;
    const completedTrips = trips.filter(trip => 
      new Date(trip.date) < new Date() && 
      (trip.createdBy.id === user.id || trip.interested.some(p => p.id === user.id))
    ).length;
    return { totalTrips, completedTrips };
  };

  const stats = getStats();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Meu Perfil</h1>
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Voltar</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-6">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-24 h-24 rounded-full border-4 border-white"
              />
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="absolute bottom-0 right-0 bg-white text-primary-600 p-2 rounded-full shadow-lg hover:bg-gray-100 transition-colors"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            </div>
            <div className="text-white">
              <h2 className="text-2xl font-bold">{user.name}</h2>
              <p className="text-primary-100">{user.age} anos</p>
              {user.location && (
                <p className="text-primary-100 flex items-center mt-1">
                  <MapPin className="w-4 h-4 mr-1" />
                  {user.location}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="p-6">
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome
                </label>
                <input
                  type="text"
                  value={editedUser.name}
                  onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Idade
                </label>
                <input
                  type="number"
                  value={editedUser.age}
                  onChange={(e) => setEditedUser({ ...editedUser, age: parseInt(e.target.value) })}
                  className="input-field"
                  min="18"
                  max="100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cidade/Estado
                </label>
                <input
                  type="text"
                  value={editedUser.location || ''}
                  onChange={(e) => setEditedUser({ ...editedUser, location: e.target.value })}
                  className="input-field"
                  placeholder="Sua localização"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bio
                </label>
                <textarea
                  value={editedUser.bio || ''}
                  onChange={(e) => setEditedUser({ ...editedUser, bio: e.target.value })}
                  className="input-field resize-none"
                  rows="3"
                  placeholder="Conte um pouco sobre você..."
                />
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={handleSaveProfile}
                  className="btn-primary"
                >
                  Salvar Alterações
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="btn-secondary"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-primary-600">{stats.totalTrips}</div>
                  <div className="text-sm text-gray-600">Viagens Totais</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-600">{stats.completedTrips}</div>
                  <div className="text-sm text-gray-600">Viagens Concluídas</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-600">{myTrips.length}</div>
                  <div className="text-sm text-gray-600">Viagens Criadas</div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-gray-700">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <span>{user.email}</span>
                </div>
                {user.bio && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2">Sobre mim</h3>
                    <p className="text-gray-700">{user.bio}</p>
                  </div>
                )}
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn-secondary flex items-center"
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  Editar Perfil
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors flex items-center"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sair
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Users className="w-5 h-5 mr-2" />
            Minhas Viagens Criadas
          </h3>
          {myTrips.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              Você ainda não criou nenhuma viagem
            </p>
          ) : (
            <div className="space-y-3">
              {myTrips.slice(0, 3).map(trip => (
                <div key={trip.id} className="border border-gray-200 rounded-lg p-3">
                  <h4 className="font-medium text-gray-900">{trip.title}</h4>
                  <p className="text-sm text-gray-600">{trip.destination}</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-gray-500">
                      {trip.interested.filter(p => p.accepted !== false).length}/{trip.maxPeople} vagas
                    </span>
                    <Link
                      to={`/trip/${trip.id}`}
                      className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                    >
                      Ver
                    </Link>
                  </div>
                </div>
              ))}
              {myTrips.length > 3 && (
                <p className="text-sm text-gray-500 text-center">
                  +{myTrips.length - 3} outras viagens
                </p>
              )}
            </div>
          )}
          {myTrips.length === 0 && (
            <Link
              to="/create"
              className="btn-primary w-full text-center mt-4"
            >
              Criar Primeira Viagem
            </Link>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <MessageCircle className="w-5 h-5 mr-2" />
            Viagens Participando
          </h3>
          {participatingTrips.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              Você ainda não está participando de nenhuma viagem
            </p>
          ) : (
            <div className="space-y-3">
              {participatingTrips.slice(0, 3).map(trip => (
                <div key={trip.id} className="border border-gray-200 rounded-lg p-3">
                  <h4 className="font-medium text-gray-900">{trip.title}</h4>
                  <p className="text-sm text-gray-600">{trip.destination}</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-gray-500">
                      Por {trip.createdBy.name}
                    </span>
                    <Link
                      to={`/chat/${trip.id}`}
                      className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                    >
                      Chat
                    </Link>
                  </div>
                </div>
              ))}
              {participatingTrips.length > 3 && (
                <p className="text-sm text-gray-500 text-center">
                  +{participatingTrips.length - 3} outras viagens
                </p>
              )}
            </div>
          )}
          {participatingTrips.length === 0 && (
            <Link
              to="/trips"
              className="btn-primary w-full text-center mt-4"
            >
              Explorar Viagens
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
