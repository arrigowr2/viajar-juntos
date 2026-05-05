import React, { useState, useEffect, useRef } from 'react';
import { Send, ArrowLeft, Users, MapPin, Calendar } from 'lucide-react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const Chat = ({ user, trips }) => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [trip, setTrip] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const foundTrip = trips.find(t => t.id === parseInt(tripId));
    setTrip(foundTrip);

    if (foundTrip) {
      const savedMessages = localStorage.getItem(`chat_${tripId}`);
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages));
      } else {
        const initialMessages = [
          {
            id: 1,
            userId: foundTrip.createdBy.id,
            userName: foundTrip.createdBy.name,
            userAvatar: foundTrip.createdBy.avatar,
            text: `Olá! Sejam bem-vindos à viagem para ${foundTrip.destination}. Fico feliz em ter companhia! 🎉`,
            timestamp: new Date(Date.now() - 3600000).toISOString()
          }
        ];
        setMessages(initialMessages);
        localStorage.setItem(`chat_${tripId}`, JSON.stringify(initialMessages));
      }
    }
  }, [tripId, trips]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const canAccessChat = () => {
    if (!trip) return false;
    if (trip.createdBy.id === user.id) return true;
    return trip.interested.some(person => person.id === user.id);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message = {
      id: Date.now(),
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      text: newMessage.trim(),
      timestamp: new Date().toISOString()
    };

    const updatedMessages = [...messages, message];
    setMessages(updatedMessages);
    localStorage.setItem(`chat_${tripId}`, JSON.stringify(updatedMessages));
    setNewMessage('');
  };

  if (!trip) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-gray-500">Carregando chat...</p>
        </div>
      </div>
    );
  }

  if (!canAccessChat()) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            Acesso Restrito
          </h3>
          <p className="text-gray-500 mb-6">
            Você precisa participar desta viagem para acessar o chat.
          </p>
          <Link
            to={`/trip/${trip.id}`}
            className="btn-primary inline-flex"
          >
            Ver Detalhes da Viagem
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-primary-600 text-white p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate(-1)}
                className="text-white hover:text-primary-200 transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div>
                <h2 className="text-lg font-semibold">{trip.title}</h2>
                <div className="flex items-center space-x-4 text-sm text-primary-100">
                  <span className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {trip.destination}
                  </span>
                  <span className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {format(new Date(trip.date), "dd/MM/yyyy", { locale: ptBR })}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span className="text-sm">
                {trip.interested.filter(p => p.accepted !== false).length + 1} participantes
              </span>
            </div>
          </div>
        </div>

        <div className="chat-container bg-gray-50 p-4">
          <div className="chat-messages space-y-4">
            {messages.map(message => (
              <div
                key={message.id}
                className={`flex ${message.userId === user.id ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-xs lg:max-w-md ${message.userId === user.id ? 'order-2' : ''}`}>
                  <div className="flex items-end space-x-2">
                    {message.userId !== user.id && (
                      <img
                        src={message.userAvatar}
                        alt={message.userName}
                        className="w-8 h-8 rounded-full"
                      />
                    )}
                    <div>
                      {message.userId !== user.id && (
                        <p className="text-xs text-gray-500 mb-1 ml-1">{message.userName}</p>
                      )}
                      <div
                        className={`px-4 py-2 rounded-2xl ${
                          message.userId === user.id
                            ? 'bg-primary-600 text-white'
                            : 'bg-white text-gray-800 shadow-sm'
                        }`}
                      >
                        <p className="text-sm">{message.text}</p>
                      </div>
                      <p className="text-xs text-gray-400 mt-1 ml-1">
                        {format(new Date(message.timestamp), "HH:mm", { locale: ptBR })}
                      </p>
                    </div>
                    {message.userId === user.id && (
                      <img
                        src={message.userAvatar}
                        alt={message.userName}
                        className="w-8 h-8 rounded-full"
                      />
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="border-t border-gray-200 p-4 bg-white">
          <form onSubmit={handleSendMessage} className="flex space-x-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Digite sua mensagem..."
              className="flex-1 input-field"
            />
            <button
              type="submit"
              disabled={!newMessage.trim()}
              className="btn-primary px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;
