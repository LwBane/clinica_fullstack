import { Link, useNavigate, NavLink } from 'react-router'
import {
    MdDashboard,
    MdExitToApp,
    MdMenu,
    MdClose,
    MdLightMode,
    MdDarkMode
} from 'react-icons/md'

import {
    FaUserPlus,
    FaListAlt,
    FaCalendarCheck
} from 'react-icons/fa'

import { useAuth } from '../../contexts/AuthContext'
import { useTheme } from '../../contexts/ThemeContext'
import { useState } from 'react'

const SideMenu = () => {
    const navigate = useNavigate()

    const { logout } = useAuth()
    const { theme, toggleTheme } = useTheme()

    // Controle do menu sanfonado
    const [isCollapsed, setIsCollapsed] = useState(false)

    // Função do logout
    const handleLogout = () => {
        logout()
        navigate('/')
    }

    // Função toggle menu
    const toggleMenu = () => {
        setIsCollapsed(!isCollapsed) // Para que o botão tenha a mesma funcionalidade, aqui eu estou criando uma interação dinâmica, pode ser tanto true como false
    }


return (
    <aside
        className={`h-screen bg-cyan-800 dark:bg-gray-900 text-white flex flex-col justify-between transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'
            }`}
    >
        {/* topo - botão toggle */}
        <div className='p-4 flex items-center justify-between border-b border-cyan-700 dark:border-gray-700'>
            {
                !isCollapsed && (
                    <h1 className='text-lg font-bold'>Clínica +</h1>
                )
            }
            <button
                onClick={toggleMenu}
                className='text-white hover:text-cyan-300 focus:outline-none'
            >
                {isCollapsed ? <MdMenu size={24} /> : <MdClose size={24} />}
                {/* Aqui em cima é só pra dizer que se estiver comprimido aparecerá um close, se não, o menu inteiro */}

            </button>
        </div>

        {/* Menu */}
        <nav className='flex-1 p-4 space-y-4 overflow-y-auto'>
            <ul className='space-y-3'>
                <li>
                    <NavLink
                        to="/dashboard"
                        className={({ isActive }) =>
                            `flex gap-2 hover:text-cyan-300 ${isActive ? "text-cyan-300" : "text-white"
                            }`
                        }
                    >
                        <MdDashboard size={20} />
                        {!isCollapsed && <span>Início</span>}
                    </NavLink>


                </li>
                <li>
                    <NavLink
                        to="/prontuarios"
                        className={({ isActive }) =>
                            `flex gap-2 hover:text-cyan-300 ${isActive ? "text-cyan-300" : "text-white"
                            }`
                        }
                    >
                        <FaCalendarCheck size={20} />
                        {!isCollapsed && <span>Prontuários</span>}
                    </NavLink>


                </li>
                <li>
                    <NavLink
                        to="/pacientes"
                        className={({ isActive }) =>
                            `flex gap-2 hover:text-cyan-300 ${isActive ? "text-cyan-300" : "text-white"
                            }`
                        }
                    >
                        <FaUserPlus size={20} />
                        {!isCollapsed && <span>Registrar Paciente</span>}
                    </NavLink>

                </li>
                <li>
                    <NavLink
                        to="/consultas"
                        className={({ isActive }) =>
                            `flex gap-2 hover:text-cyan-300 ${isActive ? "text-cyan-300" : "text-white"
                            }`
                        }
                    >
                        <MdMenu size={20} />
                        {!isCollapsed && <span>Consultas</span>}
                    </NavLink>


                </li>
                <li>
                    <NavLink
                        to="/exames"
                        className={({ isActive }) =>
                            `flex gap-2 hover:text-cyan-300 ${isActive ? "text-cyan-300" : "text-white"
                            }`
                        }
                    >
                        <FaListAlt size={20} />
                        {!isCollapsed && <span>Exames</span>}
                    </NavLink>

                </li>
                    <li>
                        <NavLink
                            to="/exames-list"
                            className={({ isActive }) =>
                                `flex gap-2 hover:text-cyan-300 ${isActive ? "text-cyan-300" : "text-white"
                                }`
                            }
                        >
                            <FaListAlt size={20} />
                            {!isCollapsed && <span>Lista de exames</span>}
                        </NavLink>

                    </li>
                </ul>
            </nav>

        {/* botao dark mode + sair */}
        <div className='p-4 border-t border-cyan-700 dark:border-gray-700 space-y-3'>
            <button
                onClick={toggleTheme}
                className='flex items-center gap-3 text-white hover:text-cyan-300 w-full cursor-pointer'
            >
                {theme === 'dark' ? <MdLightMode size={20} /> : <MdDarkMode size={20} />}
                {!isCollapsed && <span>{theme === 'dark' ? 'Modo Claro' : 'Modo Escuro'}</span>}
            </button>

            <button
                onClick={handleLogout}
                className='flex items-center gap-3 text-red-300 hover:text-red-500 w-full cursor-pointer'
            >
                <MdExitToApp size={20} />
                {!isCollapsed && <span>Sair</span>}

            </button>
        </div>

    </aside > // aside é uma tag de semântica para criar coisas laterais
)
}

export default SideMenu