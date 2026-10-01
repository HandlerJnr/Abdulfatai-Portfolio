# Companion artwork

Animated sprites for all 20 companions are sourced from the PokeAPI sprites repository, `sprites/pokemon/other/showdown/{id}.gif`. These are existing Pokémon Showdown community animations, not custom action sheets. Still alternatives come from `sprites/pokemon/{id}.png`.

Source: https://github.com/PokeAPI/sprites
Pokémon and character artwork belong to their respective rights holders; see the source repository for its credits.

The animated artwork contains internal character motion. Following, hover reactions and celebrations are additional interface movements, not separate walk/laugh/sleep drawings. Reduced-motion, hidden-tab and resting states use still alternatives. All companion runtime assets are hosted locally.

Signature effects are stylised UI interpretations of each character's type/personality, not claims about exact move animations. Reference: https://www.pokemon.com/pokedex/ (including Pikachu's electricity), https://unite.pokemon.com/en-us/pokemon/sylveon/ and https://legends.arceus.pokemon.com/en-us/pokemon/rowlet/.

Effects use inline SVG and CSS, with three quiet ambient particles and bounded, replaceable hover/tap bursts. They do not receive pointer events. Reduced motion suppresses particle animation; resting hides ambient effects. Click/tap still triggers the separate confetti celebration.
