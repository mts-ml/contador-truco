import { useEffect, useState } from "react"
import Confetti from 'react-confetti'


interface TeamsNames {
    firstTeam: string
    secondTeam: string
}

interface TeamsNamesErrors {
    firstTeam?: string
    secondTeam?: string
}

interface TeamPoints {
    firstTeamPoints: number
    secondTeamPoints: number
}


export const Home: React.FC = () => {
    const [menuOpen, setMenuOpen] = useState(false)

    const [namesAreValid, setNamesAreValid] = useState(false)

    const [isGameOver, setIsGameOver] = useState(false)

    const [overallScore, setOverallScore] = useState<TeamPoints>({
        firstTeamPoints: 0,
        secondTeamPoints: 0
    })

    const [teamsName, setTeamsName] = useState<TeamsNames>(getItemsfromLocalStorage)

    const [savedTeamsName, setSavedTeamsName] = useState<TeamsNames>(getItemsfromLocalStorage)

    const [points, setPoints] = useState<TeamPoints>({
        firstTeamPoints: 0,
        secondTeamPoints: 0
    })

    function getItemsfromLocalStorage() {
        const storedTeamsNames = localStorage.getItem("TeamsNames")

        return storedTeamsNames ? JSON.parse(storedTeamsNames) : {
            firstTeam: "Ele", secondTeam: "Ela"
        }
    }

    const [errors, setErrors] = useState<TeamsNamesErrors>({})

    function handleTeamsName(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.currentTarget
        const onlyLettersRegex = /^[A-Za-zÀ-ÿ\s]+$/;

        setTeamsName(previousNames => {
            return {
                ...previousNames,
                [name]: value
            }
        })

        if (value.trim().length < 1) {
            setNamesAreValid(false)

            setErrors(prevTeamsNamesErrors => ({
                ...prevTeamsNamesErrors,
                [name]: "Nome precisa de pelo menos uma letra."
            })
            )
        } else if (!onlyLettersRegex.test(value)) {
            setNamesAreValid(false)

            setErrors(prevTeamsNamesErrors => ({
                ...prevTeamsNamesErrors,
                [name]: "Digite apenas letras."
            }))
        } else {
            setNamesAreValid(true)

            setErrors(prevTeamsNamesErrors => ({
                ...prevTeamsNamesErrors,
                [name]: undefined
            })
            )
        }
    }

    function handleSaveTeamsName() {
        if (namesAreValid) {
            localStorage.setItem("TeamsNames", JSON.stringify(teamsName))

            setSavedTeamsName(teamsName)
        }
    }

    function handlePoints(whichTeam: "firstTeam" | "secondTeam", amount: number) {
        setPoints(previousPoints => {
            const team = whichTeam === "firstTeam" ? "firstTeamPoints" : "secondTeamPoints"

            return {
                ...previousPoints,
                [team]: Math.max(0, previousPoints[team] + amount)
            }
        })
    }

    useEffect(() => {
        if (points.firstTeamPoints >= 12 || points.secondTeamPoints >= 12) {
            setIsGameOver(true)
        } else {
            setIsGameOver(false)
        }
    }, [points])

    function newGame() {
        const firstTeamWon = points.firstTeamPoints >= 12

        setOverallScore(prevOverallScore => ({
            firstTeamPoints: prevOverallScore.firstTeamPoints + (firstTeamWon ? 1 : 0),
            secondTeamPoints: prevOverallScore.secondTeamPoints + (firstTeamWon ? 0 : 1)
        }))

        setIsGameOver(false)

        setPoints({
            firstTeamPoints: 0,
            secondTeamPoints: 0
        })
    }

    return (
        <>
            <header className="relative z-50 flex items-center bg-black h-12">
                <button
                    className={`relative ml-6 hover:bg-white/30 w-8 h-8 rounded-full transition-colors duration-500 ease-in-out ${menuOpen ? "toggle-btn" : ""}`}
                    aria-label={menuOpen ? "Click to close menu" : "Click to open menu"}
                    aria-expanded={menuOpen ? "true" : "false"}
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    <div className="absolute left-1 top-1/2 bg-white w-6 h-[2px] rounded opacity-60 transition-all duration-500
                    before:absolute before:content-[''] before:bg-white before:w-6 before:h-[2px] before:rounded  before:-translate-x-3 before:-translate-y-[6px] before:transition-all before:duration-500
                    after:absolute after:content-[''] after:bg-white after:w-6 after:h-[2px] after:rounded after:-translate-x-3 after:translate-y-[6px] after:transition-all after:duration-500"
                    />
                </button>

                <h1 className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 text-white mx-auto font-semibold">Contador Truco</h1>
            </header>

            {/* MENU */}
            <section className={`absolute z-40 w-full h-[94.7%] transition-all duration-1000 ease-in-out bg-white  px-6 ${menuOpen ? "top-12 max-h-[1000px] opacity-100 scale-y-100" : "pointer-events-none top-12 max-h-0 opacity-0 scale-y-95"}`}>
                <h4 className="mt-6 mb-4 font-bold">Equipes</h4>

                {/* 1ª equipe */}
                <label
                    className="text-sm text-black/60 cursor-pointer"
                    htmlFor="team1"
                >
                    Nome da 1ª equipe
                </label>

                <input
                    className="block border-b w-full border-black/40 "
                    type="text"
                    id="team1"
                    name="firstTeam"
                    value={teamsName.firstTeam}
                    onChange={handleTeamsName}
                />
                {errors.firstTeam && (
                    <p className="text-red-700" aria-live="assertive">{errors.firstTeam}</p>
                )}


                {/* 2ª equipe */}
                <label
                    className="block w-fit text-sm text-black/60 cursor-pointer mt-5"
                    htmlFor="team2"
                >
                    Nome da 2ª equipe
                </label>

                <input
                    className="block border-b w-full border-black/40"
                    type="text"
                    id="team2"
                    name="secondTeam"
                    value={teamsName.secondTeam}
                    onChange={handleTeamsName}
                />
                {errors.secondTeam && (
                    <p className="text-red-700" aria-live="assertive">{errors.secondTeam}</p>
                )}

                <button
                    className="text-white rounded-md w-full py-[7px] px-4 mt-6 bg-green-900"
                    onClick={handleSaveTeamsName}
                    aria-label={`Salvar nome das equipes: ${teamsName.firstTeam} e ${teamsName.secondTeam}`}
                >
                    Salvar
                </button>
            </section>

            <main className="relative z-30">
                {/* End of game */}
                {
                    isGameOver && (
                        <div>
                            <Confetti />

                            <div className="absolute top-0 w-full h-full bg-white/30 backdrop-blur-md" />

                            <div className="absolute top-1/3 -translate-y-1/3 left-1/2 -translate-x-1/2 bg-white/70 px-6 w-[80%] max-w-[500px] h-[200px] rounded-md flex flex-col items-center justify-center"
                                aria-live="polite"
                            >
                                <p>
                                    Parábens! Time <b>{points.firstTeamPoints >= 12 ? `${teamsName.firstTeam}` : `${teamsName.secondTeam}`}</b> venceu 🥳🥳🥳!!!
                                </p>

                                <button
                                    className="mt-6 mb-8 py-[7px] px-4 border border-black rounded-3xl bg-black/30 hover:bg-black/40 transition-colors duration-500 ease-in-out"
                                    onClick={newGame}
                                >
                                    Clique para jogar novamente
                                </button>
                            </div>
                        </div>
                    )
                }

                <div className="bg-stone-500 px-6 py-6">
                    <h2 className="text-white text-center font-medium py-2">Placar geral</h2>


                    <div className="relative flex items-center text-white font-bold justify-around mt-6 mb-4">
                        <p className="text-3xl pr-14" aria-label={`Placar do time ${savedTeamsName.firstTeam}`}>
                            {overallScore.firstTeamPoints}
                        </p>

                        <p className="text-3xl p" aria-label={`Placar do time ${savedTeamsName.secondTeam}`}>
                            {overallScore.secondTeamPoints}
                        </p>

                        <button
                            className="absolute py-[5px] px-3 w-fit mx-auto text-sm text-white font-bold border hover:bg-black transition-colors duration-500 ease-in-out rounded-3xl focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
                            onClick={() => setOverallScore({ firstTeamPoints: 0, secondTeamPoints: 0 })}
                        >
                            Zerar placar
                        </button>
                    </div>

                    <div>
                        <div className="flex rounded-lg bg-[#333] text-white font-medium h-[87.6vh]">

                            {/* 1º TEAM */}
                            <section className="flex flex-col items-center pt-10 w-1/2 border-r-4">
                                <h3 className="text-xl">{savedTeamsName.firstTeam}</h3>

                                <p className="text-4xl mt-3">{points.firstTeamPoints}</p>

                                <div className="flex flex-col items-center justify-evenly h-2/3 w-full">
                                    <div className="mt-10 flex items-center justify-around w-full">
                                        <button
                                            className="bg-[#111] px-4 py-[7px] xs:px-7 xs:py-[25px] rounded-full"
                                            onClick={() => handlePoints("firstTeam", -1)}
                                            aria-label={`Remover 1 ponto da equipe ${teamsName.firstTeam}`}
                                        >
                                            - 1
                                        </button>

                                        <button
                                            className="bg-[#111] px-4 py-[7px] xs:px-7 xs:py-[26px] rounded-full"
                                            onClick={() => handlePoints("firstTeam", 1)}
                                            aria-label={`Adicionar 1 ponto para a equipe ${teamsName.firstTeam}`}
                                        >
                                            + 1
                                        </button>
                                    </div>

                                    <div className="mt-10 flex items-center justify-around w-full">
                                        <button
                                            className="bg-[#111] px-4 py-[7px] xs:px-7 xs:py-[26px] rounded-full"
                                            onClick={() => handlePoints("firstTeam", -3)}
                                            aria-label={`Remover 3 pontos da equipe ${teamsName.firstTeam}.`}
                                        >
                                            - 3
                                        </button>

                                        <button
                                            className="bg-[#111] px-4 py-[7px] xs:px-7 xs:py-[26px] rounded-full"
                                            onClick={() => handlePoints("firstTeam", 3)}
                                            aria-label={`Adicionar 3 pontos para a equipe ${teamsName.firstTeam}.`}
                                        >
                                            + 3
                                        </button>
                                    </div>

                                    <div className="mt-10 flex items-center justify-around w-full">
                                        <button
                                            className="bg-[#111] px-4 py-[7px] xs:px-7 xs:py-[26px] rounded-full"
                                            onClick={() => handlePoints("firstTeam", -6)}
                                            aria-label={`Remover 6 pontos da equipe ${teamsName.firstTeam}.`}
                                        >
                                            - 6
                                        </button>

                                        <button
                                            className="bg-[#111] px-4 py-[7px] xs:px-7 xs:py-[26px] rounded-full"
                                            onClick={() => handlePoints("firstTeam", 6)}
                                            aria-label={`Adicionar 6 pontos para a equipe ${teamsName.firstTeam}.`}
                                        >
                                            + 6
                                        </button>
                                    </div>
                                </div>
                            </section>

                            {/* 2º TEAM */}
                            <section className="flex flex-col items-center pt-10 w-1/2">
                                <h3 className="text-xl">{savedTeamsName.secondTeam}</h3>

                                <p className="text-4xl mt-3">{points.secondTeamPoints}</p>

                                <div className="flex flex-col items-center justify-evenly h-2/3 w-full">
                                    <div className="mt-10 flex items-center justify-around w-full">
                                        <button
                                            className="bg-[#111] px-4 py-[7px] xs:px-7 xs:py-[26px] rounded-full"
                                            onClick={() => handlePoints("secondTeam", -1)}
                                            aria-label={`Remover 1 ponto da equipe ${teamsName.secondTeam}.`}
                                        >
                                            - 1
                                        </button>

                                        <button
                                            className="bg-[#111] px-4 py-[7px] xs:px-7 xs:py-[26px] rounded-full"
                                            onClick={() => handlePoints("secondTeam", 1)}
                                            aria-label={`Adicionar 1 ponto para a equipe ${teamsName.secondTeam}.`}
                                        >
                                            + 1
                                        </button>
                                    </div>

                                    <div className="mt-10 flex items-center justify-around w-full">
                                        <button
                                            className="bg-[#111] px-4 py-[7px] xs:px-7 xs:py-[26px] rounded-full"
                                            onClick={() => handlePoints("secondTeam", -3)}
                                            aria-label={`Remover 3 pontos da equipe ${teamsName.secondTeam}.`}
                                        >
                                            - 3
                                        </button>

                                        <button
                                            className="bg-[#111] px-4 py-[7px] xs:px-7 xs:py-[26px] rounded-full"
                                            onClick={() => handlePoints("secondTeam", 3)}
                                            aria-label={`Adicionar 3 pontos para a equipe ${teamsName.secondTeam}.`}

                                        >
                                            + 3
                                        </button>
                                    </div>

                                    <div className="mt-10 flex items-center justify-around w-full">
                                        <button
                                            className="bg-[#111] px-4 py-[7px] xs:px-7 xs:py-[26px] rounded-full"
                                            onClick={() => handlePoints("secondTeam", -6)}
                                            aria-label={`Remover 6 pontos da equipe ${teamsName.secondTeam}.`}

                                        >
                                            - 6
                                        </button>

                                        <button
                                            className="bg-[#111] px-4 py-[7px] xs:px-7 xs:py-[26px] rounded-full"
                                            onClick={() => handlePoints("secondTeam", 6)}
                                            aria-label={`Adicionar 6 pontos para a equipe ${teamsName.secondTeam}.`}

                                        >
                                            + 6
                                        </button>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </main >
        </>
    )
}
