import TrainerCard from './TrainerCard.jsx'
import '../css/TrainerList.css'

/** Lista dos treinadores do JSON. */
export default function TrainerList({ trainers, onSelectPokemon }) {
  return (
    <ul className="trainer-list">
      {trainers.map((trainer) => (
        <TrainerCard key={trainer.id} trainer={trainer} onSelectPokemon={onSelectPokemon} />
      ))}
    </ul>
  )
}
