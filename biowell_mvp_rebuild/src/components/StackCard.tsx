import React, { useState } from 'react';
import Modal from 'react-modal';
import { Brain, Pill, Calendar } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';

interface StackCardProps {
  title: string;
  supplements?: string[];
  habits?: string[];
  coachingFocus?: string[];
}

Modal.setAppElement('#root');

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#1F2937',
    border: '1px solid #374151',
    borderRadius: '1rem',
    padding: '2rem',
    maxWidth: '600px',
    width: '90%',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },
};

export default function StackCard({ 
  title,
  supplements = ["Vitamin D3", "Omega-3", "Magnesium"],
  habits = ["Morning Routine", "Sleep Hygiene", "Stress Management"],
  coachingFocus = ["Goal Setting", "Progress Tracking", "Behavioral Change"]
}: StackCardProps) {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const { t } = useTranslation();

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  return (
    <>
      <div className="bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-700">
        <h3 className="font-semibold text-xl text-center text-white mb-4">{title}</h3>
        <div className="space-y-3 mb-4">
          <div className="flex items-center text-gray-300">
            <Pill className="w-4 h-4 mr-2 text-biowellGreen" />
            <span className="text-sm">{t('stacks.components.supplements')}</span>
          </div>
          <div className="flex items-center text-gray-300">
            <Calendar className="w-4 h-4 mr-2 text-biowellBlue" />
            <span className="text-sm">{t('stacks.components.habits')}</span>
          </div>
          <div className="flex items-center text-gray-300">
            <Brain className="w-4 h-4 mr-2 text-biowellLightBlue" />
            <span className="text-sm">{t('stacks.components.coach')}</span>
          </div>
        </div>
        <button 
          onClick={openModal}
          className="w-full bg-black text-biowellGreen px-4 py-2 rounded-full hover:bg-gray-900 transition"
        >
          {t('common.learnMore')}
        </button>
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel={`${title} ${t('common.details')}`}
      >
        <div className="text-white">
          <h2 className="text-2xl font-bold mb-6">{title}</h2>
          
          <div className="space-y-6">
            <div>
              <div className="flex items-center mb-3">
                <Pill className="w-5 h-5 mr-2 text-biowellGreen" />
                <h3 className="text-lg font-semibold">{t('stacks.components.supplements')}</h3>
              </div>
              <ul className="list-disc list-inside text-gray-300 ml-7">
                {supplements.map(supplement => (
                  <li key={supplement}>{supplement}</li>
                ))}
              </ul>
            </div>

            <div>
              <div className="flex items-center mb-3">
                <Calendar className="w-5 h-5 mr-2 text-biowellBlue" />
                <h3 className="text-lg font-semibold">{t('stacks.components.habits')}</h3>
              </div>
              <ul className="list-disc list-inside text-gray-300 ml-7">
                {habits.map(habit => (
                  <li key={habit}>{habit}</li>
                ))}
              </ul>
            </div>

            <div>
              <div className="flex items-center mb-3">
                <Brain className="w-5 h-5 mr-2 text-biowellLightBlue" />
                <h3 className="text-lg font-semibold">{t('stacks.components.coachFocus')}</h3>
              </div>
              <ul className="list-disc list-inside text-gray-300 ml-7">
                {coachingFocus.map(focus => (
                  <li key={focus}>{focus}</li>
                ))}
              </ul>
            </div>
          </div>

          <button
            onClick={closeModal}
            className="mt-8 bg-biowellGreen text-black px-6 py-2 rounded-full hover:bg-opacity-90 transition"
          >
            {t('common.close')}
          </button>
        </div>
      </Modal>
    </>
  );
}