import { useCallback, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { Keyboard, MidiNumbers } from 'react-piano'
import styled from 'styled-components'
import {
  AvailableAllScalesType,
  AVAILABLE_MAJOR_SCALES,
  getFifthFromMidiNumber,
  getTriadChordFromMidiNumber,
  getSeventhChordFromMidiNumber,
  ignoreOctave,
  OCTAVE_LENGTH,
} from '../../utils'
import { TrainerContext } from '../TrainerProvider'

const PianoContainer = styled.div`
  height: 35vh;
`

interface InKeyMarkerProps {
  isSmall?: boolean
}

const InKeyMarker = styled.div<InKeyMarkerProps>`
  border-radius: 50%;
  width: ${(p) => (p.isSmall ? '2.4vw' : '4vw')};
  height: ${(p) => (p.isSmall ? '2.4vw' : '4vw')};
  max-width: 30px;
  max-height: 30px;
  background-color: #acddec;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 600;
  padding: 5px;
  margin: 2vh auto;
`

const TrainerPiano = () => {
  const {
    scale = AVAILABLE_MAJOR_SCALES['c-major'],
    isHardModeEnabled,
    noteTracker,
    practiceMode,
  } = useContext(TrainerContext)
  const { t } = useTranslation()

  const getActiveNotes = useCallback(
    (nextNote?: number) => {
      if (!nextNote) {
        return []
      }

      if (practiceMode === 'scales') {
        if (isHardModeEnabled) {
          return [noteTracker?.prevNote]
        } else {
          return [nextNote]
        }
      } else if (practiceMode === 'chords') {
        if (isHardModeEnabled) {
          return getTriadChordFromMidiNumber(noteTracker!.prevNote!, scale)
        } else {
          return getTriadChordFromMidiNumber(nextNote, scale)
        }
      } else if (practiceMode === 'seventhChords') {
        if (isHardModeEnabled) {
          return getSeventhChordFromMidiNumber(noteTracker!.prevNote!, scale)
        } else {
          return getSeventhChordFromMidiNumber(nextNote, scale)
        }
      } else if (practiceMode === 'fifths') {
        if (isHardModeEnabled) {
          return [
            noteTracker!.prevNote!,
            getFifthFromMidiNumber(
              noteTracker!.prevNote!,
              scale.value as AvailableAllScalesType
            ),
          ]
        } else {
          return [
            nextNote,
            getFifthFromMidiNumber(
              nextNote,
              scale.value as AvailableAllScalesType
            ),
          ]
        }
      }
    },
    [isHardModeEnabled, practiceMode, scale, noteTracker]
  )

  return (
    <PianoContainer>
      <Keyboard
        noteRange={{
          first: MidiNumbers.fromNote('c3'),
          last: MidiNumbers.fromNote('c5'),
        }}
        activeNotes={getActiveNotes(noteTracker?.nextTargetMidiNumber)}
        onPlayNoteInput={() => {}}
        onStopNoteInput={() => {}}
        keyWidthToHeight={0.33}
        renderNoteLabel={({
          midiNumber,
          isAccidental,
        }: {
          midiNumber: number
          isAccidental: boolean
        }) => {
          const isMidiNumbers = false
          // modScale will be the midi numbers in-scale starting from c0
          const modScale = ignoreOctave(scale || { keys: {} })
          if (isMidiNumbers) {
            return (
              <InKeyMarker isSmall={isAccidental}>{midiNumber}</InKeyMarker>
            )
          } else {
            if (isHardModeEnabled) {
              // only add the roman numeral if it's the first note in the scale
              const noOctaveFirstNoteInScale = Number(
                Object.keys(modScale[0])[0]
              )
              if (midiNumber % OCTAVE_LENGTH === noOctaveFirstNoteInScale) {
                return (
                  <InKeyMarker isSmall={isAccidental}>
                    {Object.values(modScale[0])[0]}
                  </InKeyMarker>
                )
              }
            } else {
              // TODO: Refactor this to be more readable
              // Basically checking if the midiNumber is in the modScale array of Objects
              const modKeyIdx = modScale.findIndex(
                (m) => Object.keys(m)[0] === String(midiNumber % OCTAVE_LENGTH)
              )

              // if it is, display the roman numeral
              if (modKeyIdx > -1) {
                return (
                  <InKeyMarker isSmall={isAccidental}>
                    {t(
                      `piano.numeral.${
                        Object.values(modScale[modKeyIdx] || {})?.[0]
                      }`
                    )}
                  </InKeyMarker>
                )
              }
            }
          }
        }}
      />
    </PianoContainer>
  )
}

export default TrainerPiano
