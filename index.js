/**
 * INTERATIVIDADE & ANIMAÇÕES - MÍDIA EVENTOS FORMATURAS
 */

document.addEventListener("DOMContentLoaded", () => {
    // 1. Efeito do Header e Parallax no Hero ao rolar a página (Unificados para performance)
    const header = document.getElementById("header");
    const heroBg = document.querySelector(".hero-background");
    
    const handleScroll = () => {
        const scrollY = window.scrollY;
        
        // Efeito do Header
        if (header) {
            if (scrollY > 50) {
                header.classList.add("scrolled");
            } else {
                header.classList.remove("scrolled");
            }
        }
        
        // Efeito Parallax no fundo Hero (apenas enquanto visível)
        if (heroBg && scrollY <= window.innerHeight) {
            heroBg.style.transform = `translateY(${scrollY * 0.35}px) scale(1.15)`;
        }
    };
    
    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Executar imediatamente para lidar com refresh de página no meio


    // 2. Menu Mobile Toggle
    const menuToggle = document.getElementById("menuToggle");
    const navMenu = document.getElementById("navMenu");
    const navLinks = document.querySelectorAll(".nav-link");

    if (menuToggle && navMenu) {
        menuToggle.addEventListener("click", () => {
            menuToggle.classList.toggle("active");
            navMenu.classList.toggle("active");
            
            // Impedir rolagem quando menu está aberto no mobile
            document.body.style.overflow = navMenu.classList.contains("active") ? "hidden" : "";
        });

        // Fechar o menu ao clicar em qualquer link
        navLinks.forEach(link => {
            link.addEventListener("click", () => {
                menuToggle.classList.remove("active");
                navMenu.classList.remove("active");
                document.body.style.overflow = "";
            });
        });
    }

    // 3. Sistema de Animação de Entrada ao Rolar a Página (Scroll Triggers)
    const initInViewAnimations = () => {
        // Inserir estilos adicionais via JS se necessário
        const style = document.createElement("style");
        style.textContent = `
            .animate-on-scroll {
                opacity: 0;
                transform: translateY(30px);
                filter: blur(8px);
                transition: opacity 0.8s ease-out, transform 0.8s ease-out, filter 0.8s ease-out;
            }
            .animate-on-scroll.animate {
                opacity: 1;
                transform: translateY(0);
                filter: blur(0);
            }
        `;
        document.head.appendChild(style);

        const observerOptions = {
            threshold: 0.1,
            rootMargin: "0px 0px -10% 0px"
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("animate");
                    observer.unobserve(entry.target); // Animar apenas uma vez
                }
            });
        }, observerOptions);

        document.querySelectorAll(".animate-on-scroll").forEach(el => {
            observer.observe(el);
        });
    };

    // Inicializar animações de scroll
    if ('IntersectionObserver' in window) {
        initInViewAnimations();
    } else {
        // Fallback caso navegador não suporte IntersectionObserver
        document.querySelectorAll(".animate-on-scroll").forEach(el => {
            el.style.opacity = "1";
            el.style.transform = "none";
            el.style.filter = "none";
        });
    }

    // 4. Sistema de Lightbox Dinâmico para o Portfólio com Navegação
    const portfolioItems = document.querySelectorAll(".portfolio-item");
    if (portfolioItems.length > 0) {
        // Criar estrutura do Lightbox e adicionar ao body
        const lightbox = document.createElement("div");
        lightbox.className = "lightbox-modal";
        lightbox.id = "lightboxModal";
        lightbox.innerHTML = `
            <button class="lightbox-close-btn" id="lightboxClose" aria-label="Fechar Galeria">&times;</button>
            <button class="lightbox-nav-btn prev" id="lightboxPrev" aria-label="Imagem Anterior">&lsaquo;</button>
            <div class="lightbox-content-wrapper">
                <img src="" alt="Imagem Ampliada" class="lightbox-image" id="lightboxImg">
            </div>
            <button class="lightbox-nav-btn next" id="lightboxNext" aria-label="Próxima Imagem">&rsaquo;</button>
        `;
        document.body.appendChild(lightbox);

        const lightboxImg = document.getElementById("lightboxImg");
        const lightboxClose = document.getElementById("lightboxClose");
        const lightboxPrev = document.getElementById("lightboxPrev");
        const lightboxNext = document.getElementById("lightboxNext");

        let currentIndex = 0;
        
        // Mapear imagens do portfólio
        const images = Array.from(portfolioItems).map(item => {
            const img = item.querySelector(".portfolio-img");
            return {
                src: img ? img.src : "",
                alt: img ? img.alt : ""
            };
        });

        const showImage = (index) => {
            if (index < 0) {
                currentIndex = images.length - 1;
            } else if (index >= images.length) {
                currentIndex = 0;
            } else {
                currentIndex = index;
            }
            if (lightboxImg && images[currentIndex]) {
                lightboxImg.src = images[currentIndex].src;
                lightboxImg.alt = images[currentIndex].alt;
            }
        };

        portfolioItems.forEach((item, index) => {
            item.addEventListener("click", () => {
                showImage(index);
                lightbox.classList.add("active");
                document.body.style.overflow = "hidden";
            });
        });

        // Eventos dos botões de navegação
        lightboxPrev.addEventListener("click", (e) => {
            e.stopPropagation();
            showImage(currentIndex - 1);
        });

        lightboxNext.addEventListener("click", (e) => {
            e.stopPropagation();
            showImage(currentIndex + 1);
        });

        // Fechar ao clicar no botão
        lightboxClose.addEventListener("click", () => {
            lightbox.classList.remove("active");
            document.body.style.overflow = "";
        });

        // Fechar ao clicar no background (fora da imagem e botões de navegação)
        lightbox.addEventListener("click", (e) => {
            if (e.target === lightbox) {
                lightbox.classList.remove("active");
                document.body.style.overflow = "";
            }
        });

        // Teclado (ESC, Setas Esquerda/Direita)
        document.addEventListener("keydown", (e) => {
            if (lightbox.classList.contains("active")) {
                if (e.key === "Escape") {
                    lightbox.classList.remove("active");
                    document.body.style.overflow = "";
                } else if (e.key === "ArrowLeft") {
                    showImage(currentIndex - 1);
                } else if (e.key === "ArrowRight") {
                    showImage(currentIndex + 1);
                }
            }
        });
    }

    // 5. Máscara de WhatsApp / Telefone
    const telInput = document.getElementById("whatsapp");
    if (telInput) {
        telInput.addEventListener("input", (e) => {
            let x = e.target.value.replace(/\D/g, '').match(/(\d{0,2})(\d{0,5})(\d{0,4})/);
            e.target.value = !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');
        });
    }

    // 6. Envio de Lead Form & Validação
    const leadForm = document.getElementById("leadForm");
    if (leadForm) {
        leadForm.addEventListener("submit", (e) => {
            e.preventDefault();
            let isValid = true;
            const inputs = leadForm.querySelectorAll("input[required], select[required]");

            inputs.forEach(input => {
                const group = input.closest(".form-group");
                if (!input.value.trim()) {
                    group.classList.add("invalid");
                    isValid = false;
                } else {
                    group.classList.remove("invalid");
                }
            });

            if (isValid) {
                const submitBtn = leadForm.querySelector(".btn-submit");
                submitBtn.disabled = true;
                submitBtn.textContent = "Enviando...";

                // Simular envio de API
                setTimeout(() => {
                    const nome = document.getElementById("nome").value;
                    const whatsapp = document.getElementById("whatsapp").value;
                    
                    // Substituir formulário por mensagem de sucesso
                    leadForm.style.transition = "opacity 0.4s ease";
                    leadForm.style.opacity = "0";
                    
                    setTimeout(() => {
                        leadForm.innerHTML = `
                            <div class="success-message" style="text-align: center; padding: 2rem 0; display: flex; flex-direction: column; align-items: center; gap: 1.5rem;">
                                <div style="width: 60px; height: 60px; border-radius: 50%; background-color: rgba(201, 168, 78, 0.1); border: 2px solid var(--color-accent); display: flex; align-items: center; justify-content: center; color: var(--color-accent); font-size: 2rem; font-weight: bold;">✓</div>
                                <h3 style="font-family: var(--font-heading); color: var(--color-text-primary); font-size: 1.5rem; text-transform: uppercase;">Solicitação Recebida!</h3>
                                <p style="color: var(--color-text-secondary); line-height: 1.6; max-width: 450px; font-weight: 300;">Obrigado, <strong>${nome}</strong>! Nossa equipe especializada já foi notificada. Entraremos em contato com você via WhatsApp no número <strong>${whatsapp}</strong> para elaborar a proposta personalizada de sua turma.</p>
                            </div>
                        `;
                        leadForm.style.opacity = "1";
                    }, 400);
                }, 1500);
            }
        });

        // Remover erro ao digitar/interagir
        leadForm.querySelectorAll("input, select").forEach(input => {
            input.addEventListener("input", () => {
                input.closest(".form-group").classList.remove("invalid");
            });
            input.addEventListener("change", () => {
                input.closest(".form-group").classList.remove("invalid");
            });
        });
    }
});
