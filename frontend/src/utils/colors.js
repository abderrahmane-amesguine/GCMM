// Couleurs pour les axes
export const axisColors = [
  '#3366CC', // Bleu
  '#DC3912', // Rouge
  '#FF9900', // Orange
  '#109618', // Vert
  '#990099'  // Violet
];

// Fonction pour obtenir la couleur en fonction du score
export const getScoreColor = (score) => {
  if (score < 2) return 'text-red-500';
  if (score < 3) return 'text-yellow-500';
  if (score < 4) return 'text-blue-500';
  return 'text-green-500';
};

// Fonction pour obtenir la classe de badge en fonction du score
export const getScoreBadgeClass = (score) => {
  if (score < 2) return 'bg-red-100 text-red-800';
  if (score < 3) return 'bg-yellow-100 text-yellow-800';
  if (score < 4) return 'bg-blue-100 text-blue-800';
  return 'bg-green-100 text-green-800';
};

import { useTranslation } from "react-i18next";
// Fonction pour obtenir le texte de l'évaluation en fonction du score
export const getScoreLabel = (score) => {
  const { t } = useTranslation();
  if (score < 2) return t('scoreLabel.Poor');
  if (score < 3) return t('scoreLabel.Average');
  if (score < 4) return t('scoreLabel.Good');
  return t('scoreLabel.Excellent');
};