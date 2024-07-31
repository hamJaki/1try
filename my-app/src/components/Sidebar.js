// // Sidebar.js
// import React from 'react';
// import { motion } from 'framer-motion';
// import '../styles/Sidebar.css';
//
// const chatOptions = [
//     { id: 'advanced-counting-techniques', name: 'Advanced Counting Techniques', docUrl: '/texfiles/advanced_counting_techniques.tex' },
//     { id: 'algorithms', name: 'Algorithms', docUrl: '/texfiles/algorithms.tex' },
//     { id: 'basic-structures', name: 'Basic Structures: Sets, Functions, Sequences, Sums, and Matrices', docUrl: '/texfiles/basic_structures_sets_functions_sequences_sums_and_matrices.tex' },
//     { id: 'boolean-algebra', name: 'Boolean Algebra', docUrl: '/texfiles/boolean_algebra.tex' },
//     { id: 'counting', name: 'Counting', docUrl: '/texfiles/counting.tex' },
//     { id: 'discrete-probability', name: 'Discrete Probability', docUrl: '/texfiles/discrete_probability.tex' },
//     { id: 'graphs', name: 'Graphs', docUrl: '/texfiles/graphs.tex' },
//     { id: 'induction-and-recursion', name: 'Induction and Recursion', docUrl: '/texfiles/induction_and_recursion.tex' },
//     { id: 'modeling-computation', name: 'Modeling Computation', docUrl: '/texfiles/modeling_computation.tex' },
//     { id: 'number-theory-and-cryptography', name: 'Number Theory and Cryptography', docUrl: '/texfiles/number_theory_and_cryptography.tex' },
//     { id: 'relations', name: 'Relations', docUrl: '/texfiles/relations.tex' },
//     { id: 'the-foundations', name: 'The Foundations: Logic and Proofs', docUrl: '/texfiles/the_foundations_logic_and_proofs.tex' },
//     { id: 'trees', name: 'Trees', docUrl: '/texfiles/trees.tex' },
// ];
//
//
// function Sidebar({ activeChat, setActiveChat }) {
//     return (
//         <motion.div
//             className="sidebar"
//             initial={{ x: -250 }}
//             animate={{ x: 0 }}
//             transition={{ duration: 0.5 }}
//         >
//             <nav>
//                 {chatOptions.map((option) => (
//                     <motion.div key={option.id} className="chat-option-container">
//                         <motion.button
//                             key={option.id}
//                             className={`chat-option ${activeChat === option.id ? 'active' : ''}`}
//                             onClick={() => setActiveChat(option.id)}
//                             whileHover={{ scale: 1.05 }}
//                             whileTap={{ scale: 0.95 }}
//                         >
//                             {option.name}
//                         </motion.button>
//                         {option.docUrl && (
//                             <a href={option.docUrl} target="_blank" rel="noopener noreferrer" className="doc-link">
//                                 📄
//                             </a>
//                         )}
//                     </motion.div>
//                 ))}
//             </nav>
//         </motion.div>
//     );
// }
//
// export default Sidebar;
