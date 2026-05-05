import React, { useState } from 'react';
import { MapPin, Calendar, Users, Tag, FileText, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CreateTrip = ({ user, onCreateTrip }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    destination: '',
    date: '',
    description: '',
    category: 'praia',
    maxPeople: 2
  });
  const [error, setError] = useState('');

  const categories = [
    { value: 'praia', label: 'Praia', icon: '🏖️' },
    { value: 'montanha', label: 'Montanha', icon: '⛰️' },
    { value: 'cidade', label: 'Cidade', icon: '🏙️' },
    { value: 'evento', label: 'Evento', icon: '🎉' },
    { value: 'natureza', label: 'Natureza', icon: '🌲' },
    { value: 'cultural', label: 'Cultural', icon: '🏛️' },
    { value: 'aventura', label: 'Aventura', icon: '🎢' },
    { value: 'gastronomico', label: 'Gastronômico', icon: '🍽️' }
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title || !formData.destination || !formData.date || !formData.description) {
      setError('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    const tripDate = new Date(formData.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (tripDate < today) {
      setError('A data da viagem não pode ser no passado');
      return;
    }

    onCreateTrip(formData);
    navigate('/dashboard');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <button
        onClick={() => navigate('/dashboard')}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Voltar</span>
      </button>

      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-primary-100 p-3 rounded-full">
              <MapPin className="w-8 h-8 text-primary-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Criar Nova Viagem</h1>
          <p className="text-gray-600">Encontre companhia para sua próxima aventura</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Título da Viagem *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="input-field"
              placeholder="Ex: Viagem para a Praia do Rosa"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Destino *
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                name="destination"
                value={formData.destination}
                onChange={handleChange}
                className="input-field pl-10"
                placeholder="Ex: Florianópolis, SC"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data da Viagem *
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="input-field pl-10"
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categoria *
            </label>
            <div className="relative">
              <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="input-field pl-10 appearance-none"
                required
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.icon} {cat.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Número Máximo de Pessoas *
            </label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="number"
                name="maxPeople"
                value={formData.maxPeople}
                onChange={handleChange}
                className="input-field pl-10"
                min="1"
                max="10"
                required
              />
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Incluindo você (máximo 10 pessoas)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descrição *
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="input-field pl-10 resize-none"
                rows="4"
                placeholder="Descreva sua viagem, o que planejam fazer, tipo de companhia que procura..."
                required
              />
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 mb-2">Dicas para uma boa descrição:</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Seja específico sobre o tipo de companhia que procura</li>
              <li>• Mencione atividades planejadas</li>
              <li>• Informe sobre custos ou se pretende dividir despesas</li>
              <li>• Descreva o nível de experiência necessário (se aplicável)</li>
            </ul>
          </div>

          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="flex-1 btn-secondary"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 btn-primary text-lg py-3"
            >
              Criar Viagem
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTrip;
