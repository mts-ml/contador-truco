import { useState } from "react"


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
                    <p className="text-red-700">{errors.firstTeam}</p>
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
                    <p className="text-red-700">{errors.secondTeam}</p>
                )}

                <button
                    className="text-white rounded-md w-full py-[7px] px-4 mt-6 bg-green-900"
                    onClick={handleSaveTeamsName}
                >
                    Salvar
                </button>
            </section>

            <main className="relative z-30">
                <div className="bg-stone-500 px-6 pb-6">
                    <h2 className="text-white text-center font-medium py-2">Placar geral:</h2>

                    <div>
                        <div className="flex rounded-lg bg-[#333] text-white font-medium h-[87.6vh]">
                            <section className="flex flex-col items-center pt-10 w-1/2 border-r-4">
                                <h3>{savedTeamsName.firstTeam}</h3>
                                <p>{points.firstTeamPoints}</p>
                            </section>

                            <section className="flex flex-col items-center pt-10 w-1/2">
                                <h3>{savedTeamsName.secondTeam}</h3>
                                <p>{points.secondTeamPoints}</p>
                            </section>
                        </div>
                    </div>
                </div>
            </main >
        </>
    )
}
