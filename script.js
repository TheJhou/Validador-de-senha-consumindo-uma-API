// Seleção de elementos do DOM
const passwordInput = document.getElementById('password');
const toggleBtn = document.getElementById('toggle-password');
const strengthFill = document.getElementById('strength-fill');
const strengthText = document.getElementById('strength-text');
const requirements = {
    length: document.getElementById('req-length'),
    uppercase: document.getElementById('req-uppercase'),
    lowercase: document.getElementById('req-lowercase'),
    number: document.getElementById('req-number'),
    special: document.getElementById('req-special')
};
const apiStatus = document.getElementById('api-status');
const feedback = document.getElementById('feedback');
const personalDataCheckbox = document.getElementById('personal-data');
const personalDataWarning = document.getElementById('personal-data-warning');
const compromisedCheckbox = document.getElementById('compromised-password');
const compromisedWarning = document.getElementById('compromised-warning');
const scoreValue = document.getElementById('score-value');

// Funções de verificação
function checkLength(password) {
    return password.length >= 8;
}

function checkUppercase(password) {
    return /[A-Z]/.test(password);
}

function checkLowercase(password) {
    return /[a-z]/.test(password);
}

function checkNumber(password) {
    return /[0-9]/.test(password);
}

function checkSpecial(password) {
    return /[!@#$%^&*(),.?":{}|<>]/.test(password);
}

// Cálculo de força da senha
function calculateStrength(password) {
    let score = 0;
    if (checkLength(password)) score++;
    if (checkUppercase(password)) score++;
    if (checkLowercase(password)) score++;
    if (checkNumber(password)) score++;
    if (checkSpecial(password)) score++;
    
    // Reduzir pontuação se contém dados pessoais
    if (personalDataCheckbox.checked && score > 0) {
        score = Math.max(1, score - 1);
    }
    
    return score;
}

// Cálculo de score de 1 a 100
function calculateScore(password) {
    let score = 0;
    
    // Cada requisito vale 20 pontos
    if (checkLength(password)) score += 20;
    if (checkUppercase(password)) score += 20;
    if (checkLowercase(password)) score += 20;
    if (checkNumber(password)) score += 20;
    if (checkSpecial(password)) score += 20;
    
    // Reduzir score se contém dados pessoais
    if (personalDataCheckbox.checked && score > 0) {
        score = Math.max(0, score - 20);
    }
    
    // Reduzir score se já foi comprometida/compartilhada
    if (compromisedCheckbox.checked && score > 0) {
        score = Math.max(0, score - 30);
    }
    
    return score;
}

// Atualização do score de 1 a 100
function updateScore(password) {
    const score = calculateScore(password);
    scoreValue.textContent = score;
    
    // Mudar cor do score baseado no valor
    if (score >= 80) {
        scoreValue.style.color = 'var(--success)';
    } else if (score >= 50) {
        scoreValue.style.color = 'var(--warning)';
    } else if (score > 0) {
        scoreValue.style.color = 'var(--error)';
    } else {
        scoreValue.style.color = '#888';
    }
}

// Atualização visual da barra de progresso
function updateStrengthBar(password) {
    const strength = calculateStrength(password);
    
    strengthFill.className = 'strength-fill';
    
    if (password.length === 0) {
        strengthFill.style.width = '0%';
        strengthText.textContent = '';
    } else if (strength <= 2) {
        strengthFill.classList.add('weak');
        strengthText.textContent = 'Força: Fraca';
    } else if (strength <= 4) {
        strengthFill.classList.add('medium');
        strengthText.textContent = 'Força: Média';
    } else {
        strengthFill.classList.add('strong');
        strengthText.textContent = 'Força: Forte';
    }
}

// Atualização da lista de verificação
function updateRequirements(password) {
    requirements.length.className = checkLength(password) ? 'valid' : 'invalid';
    requirements.length.textContent = checkLength(password) ? '✓ Mínimo 8 caracteres' : '✗ Mínimo 8 caracteres';
    
    requirements.uppercase.className = checkUppercase(password) ? 'valid' : 'invalid';
    requirements.uppercase.textContent = checkUppercase(password) ? '✓ Letra maiúscula (A-Z)' : '✗ Letra maiúscula (A-Z)';
    
    requirements.lowercase.className = checkLowercase(password) ? 'valid' : 'invalid';
    requirements.lowercase.textContent = checkLowercase(password) ? '✓ Letra minúscula (a-z)' : '✗ Letra minúscula (a-z)';
    
    requirements.number.className = checkNumber(password) ? 'valid' : 'invalid';
    requirements.number.textContent = checkNumber(password) ? '✓ Número (0-9)' : '✗ Número (0-9)';
    
    requirements.special.className = checkSpecial(password) ? 'valid' : 'invalid';
    requirements.special.textContent = checkSpecial(password) ? '✓ Caractere especial (!@#$%...)' : '✗ Caractere especial (!@#$%...)';
}

// Toggle mostrar/ocultar senha
toggleBtn.addEventListener('click', () => {
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleBtn.textContent = '🙈';
    } else {
        passwordInput.type = 'password';
        toggleBtn.textContent = '👁️';
    }
});

// Event listener para checkbox de dados pessoais
personalDataCheckbox.addEventListener('change', () => {
    if (personalDataCheckbox.checked) {
        personalDataWarning.classList.add('show');
    } else {
        personalDataWarning.classList.remove('show');
    }
    
    // Atualizar score quando checkbox mudar
    updateScore(passwordInput.value);
    updateStrengthBar(passwordInput.value);
    updateFeedback(passwordInput.value);
});

// Event listener para checkbox de senha comprometida
compromisedCheckbox.addEventListener('change', () => {
    if (compromisedCheckbox.checked) {
        compromisedWarning.classList.add('show');
    } else {
        compromisedWarning.classList.remove('show');
    }
    
    // Atualizar score quando checkbox mudar
    updateScore(passwordInput.value);
    updateStrengthBar(passwordInput.value);
    updateFeedback(passwordInput.value);
});

// Gerar hash SHA-1 usando Web Crypto API
async function sha1Hash(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-1', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex.toUpperCase();
}

// Chamada à API Have I Been Pwned
async function checkPwnedPassword(password) {
    try {
        const hash = await sha1Hash(password);
        const prefix = hash.substring(0, 5);
        const suffix = hash.substring(5);
        
        const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
        
        if (!response.ok) {
            throw new Error('Erro na API');
        }
        
        const data = await response.text();
        const hashes = data.split('\n');
        
        for (const line of hashes) {
            const [hashSuffix, count] = line.split(':');
            if (hashSuffix === suffix) {
                return { pwned: true, count: parseInt(count) };
            }
        }
        
        return { pwned: false, count: 0 };
    } catch (error) {
        console.error('Erro ao verificar senha:', error);
        return { pwned: false, error: true };
    }
}

// Debounce para não fazer chamadas API a cada tecla
let debounceTimer;
function debouncedCheck(password) {
    clearTimeout(debounceTimer);
    
    if (password.length === 0) {
        apiStatus.textContent = '';
        apiStatus.className = 'api-status';
        feedback.textContent = '';
        feedback.className = 'feedback';
        return;
    }
    
    apiStatus.textContent = 'Verificando...';
    apiStatus.className = 'api-status loading';
    
    debounceTimer = setTimeout(async () => {
        const result = await checkPwnedPassword(password);
        
        if (result.error) {
            apiStatus.textContent = 'Erro ao verificar senha';
            apiStatus.className = 'api-status error';
        } else if (result.pwned) {
            apiStatus.textContent = `⚠️ Senha comprometida (encontrada ${result.count} vezes)`;
            apiStatus.className = 'api-status compromised';
        } else {
            apiStatus.textContent = '✓ Senha não encontrada em vazamentos';
            apiStatus.className = 'api-status safe';
        }
    }, 500);
}

// Feedback final
function updateFeedback(password) {
    const allValid = checkLength(password) && 
                    checkUppercase(password) && 
                    checkLowercase(password) && 
                    checkNumber(password) && 
                    checkSpecial(password);
    
    if (password.length === 0) {
        feedback.textContent = '';
        feedback.className = 'feedback';
    } else if (allValid) {
        feedback.textContent = '✓ Senha forte e segura!';
        feedback.className = 'feedback success';
    } else {
        feedback.textContent = '✗ Complete todos os requisitos';
        feedback.className = 'feedback error';
    }
}

// Event listener para input de senha
passwordInput.addEventListener('input', (e) => {
    // Remover espaços do valor
    const password = e.target.value.replace(/\s/g, '');
    e.target.value = password;
    
    updateScore(password);
    updateStrengthBar(password);
    updateRequirements(password);
    updateFeedback(password);
    debouncedCheck(password);
});
