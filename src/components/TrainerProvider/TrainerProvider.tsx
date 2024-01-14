import {
  createContext,
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useState,
} from 'react'
import {
  AvailablePracticeModesType,
  AvailableScreensType,
  AVAILABLE_SCALES,
  ScaleType,
  SCALE_LENGTH,
} from '../../utils'

interface NoteTracker {
  currentMidiNumber: number
  nextTargetMidiNumber: number
  prevNote?: number
  noteCounter: number
}

type TrainerContextType = {
  children?: React.ReactNode

  // Core functionality
  scale?: ScaleType
  setScale?: Dispatch<SetStateAction<ScaleType>>
  /** Responsible for storing the current chord being played */
  chordStack?: number[]
  setChordStack?: Dispatch<SetStateAction<number[]>>
  /** Keeps track of where we are in the scale, etc. */
  noteTracker?: NoteTracker
  setNoteTracker?: Dispatch<SetStateAction<NoteTracker>>

  // Settings
  practiceMode?: AvailablePracticeModesType
  setPracticeMode?: Dispatch<SetStateAction<AvailablePracticeModesType>>
  currentScreen?: AvailableScreensType
  setCurrentScreen?: Dispatch<SetStateAction<AvailableScreensType>>
  isScalePingPong?: boolean
  setIsScalePingPong?: Dispatch<SetStateAction<boolean>>
  isHardModeEnabled?: boolean
  setIsHardModeEnabled?: Dispatch<SetStateAction<boolean>>
  isShuffleModeEnabled?: boolean
  setIsShuffleModeEnabled?: Dispatch<SetStateAction<boolean>>
}

export const TrainerContext = createContext({} as TrainerContextType)

const TrainerProvider: FC<TrainerContextType> = ({ children }) => {
  const [scale, setScale] = useState<ScaleType>(AVAILABLE_SCALES['c-major'])
  const [noteTracker, setNoteTracker] = useState<NoteTracker>({
    currentMidiNumber: Number(Object.keys(scale.keys)[0]),
    noteCounter: 0,
    prevNote: Number(Object.keys(scale.keys)[0]),
    nextTargetMidiNumber: Number(Object.keys(scale.keys)[0]),
  })
  const [chordStack, setChordStack] = useState<number[]>([])
  const [practiceMode, setPracticeMode] =
    useState<AvailablePracticeModesType>('scales')
  const [currentScreen, setCurrentScreen] =
    useState<AvailableScreensType>('practice')
  const [isScalePingPong, setIsScalePingPong] = useState(false)
  const [isHardModeEnabled, setIsHardModeEnabled] = useState(false)
  const [isShuffleModeEnabled, setIsShuffleModeEnabled] = useState(false)

  const [_isGoingDown, _setIsGoingDown] = useState(false)

  const context: TrainerContextType = {
    scale,
    setScale,
    noteTracker,
    setNoteTracker,
    chordStack,
    setChordStack,
    practiceMode,
    setPracticeMode,
    currentScreen,
    setCurrentScreen,
    isScalePingPong,
    setIsScalePingPong,
    isHardModeEnabled,
    setIsHardModeEnabled,
    isShuffleModeEnabled,
    setIsShuffleModeEnabled,
  }

  const randomizeScale = () => {
    const randomScaleIdx = Math.floor(
      Math.random() * Object.keys(AVAILABLE_SCALES).length
    )
    const randomScale = Object.values(AVAILABLE_SCALES)[randomScaleIdx]
    setScale(randomScale)
  }

  useEffect(() => {
    const prevNote = noteTracker.currentMidiNumber
    const scaleStartMidiNumber = Number(Object.keys(scale.keys)[0])
    const scaleEndMidiNumber = Number(Object.keys(scale.keys).reverse()[0])
    const nextTargetMidiNumber = Number(
      Object.keys(scale.keys).reverse()[noteTracker.noteCounter % SCALE_LENGTH]
    )

    if (isScalePingPong && _isGoingDown) {
      // determine if we're at the end of the ping pong
      if (noteTracker.currentMidiNumber === scaleStartMidiNumber) {
        _setIsGoingDown(false)

        if (isShuffleModeEnabled) {
          randomizeScale()
        }
      } else {
        // otherwise, keep going down the scale
        setNoteTracker((nt) => ({
          ...nt,
          prevNote,
          nextTargetMidiNumber,
        }))
      }
    } else {
      // determine if we're at the end of the scale (going up)
      if (noteTracker.currentMidiNumber === scaleEndMidiNumber) {
        _setIsGoingDown(true)

        if (!isScalePingPong) {
          // if we're not ping ponging, reset to the beginning of the scale
          // prevNote is our hint for the next note, it depends on hard mode
          setNoteTracker((nt) => ({
            ...nt,
            prevNote: isHardModeEnabled ? scaleStartMidiNumber : prevNote,
            nextTargetMidiNumber: scaleStartMidiNumber,
          }))
        }

        if (isShuffleModeEnabled) {
          randomizeScale()
        }
      } else {
        // otherwise, keep going up the scale
        setNoteTracker((nt) => ({
          ...nt,
          prevNote: noteTracker.currentMidiNumber,
          nextTargetMidiNumber: Number(
            Object.keys(scale.keys)[noteTracker.noteCounter % SCALE_LENGTH]
          ),
        }))
      }
    }
  }, [
    _isGoingDown,
    isScalePingPong,
    noteTracker.currentMidiNumber,
    noteTracker.noteCounter,
    noteTracker.nextTargetMidiNumber,
    scale.keys,
    isHardModeEnabled,
    isShuffleModeEnabled,
  ])

  useEffect(() => {
    // if certain settings change, reset the note tracker
    setNoteTracker((nt) => ({
      ...nt,
      noteCounter: 0,
      nextTargetMidiNumber: Number(Object.keys(scale.keys)[0]),
      currentMidiNumber: Number(Object.keys(scale.keys)[0]),
      prevNote: Number(Object.keys(scale.keys)[0]),
    }))
  }, [
    scale,
    isScalePingPong,
    currentScreen,
    practiceMode,
    isHardModeEnabled,
    isShuffleModeEnabled,
  ])

  return (
    <TrainerContext.Provider value={context}>
      {children}
    </TrainerContext.Provider>
  )
}

export default TrainerProvider
