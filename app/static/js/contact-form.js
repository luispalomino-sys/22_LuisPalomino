
document.addEventListener("DOMContentLoaded", () => {
    const formStep1 = document.getElementById("contact-form-step-1");
    const formStep2 = document.getElementById("contact-form-step-2");

    // Este script solo funciona en la página de contactos.
    if (!formStep1 || !formStep2) return;

    const stepIndicator1 = document.getElementById("contact-step-1");
    const stepIndicator2 = document.getElementById("contact-step-2");
    const backButton = document.getElementById("btn-back-step");
    const successMessage = document.getElementById("contact-success");

    const nameInput = document.getElementById("contact-name");
    const emailInput = document.getElementById("contact-email");
    const phoneInput = document.getElementById("contact-phone");
    const subjectInput = document.getElementById("contact-subject");
    const messageInput = document.getElementById("contact-message");

    function showStep(step) {
        const firstStep = step === 1;

        formStep1.classList.toggle("hidden", !firstStep);
        formStep2.classList.toggle("hidden", firstStep);

        if (stepIndicator1 && stepIndicator2) {
            stepIndicator1.classList.toggle("bg-[#166451]", firstStep);
            stepIndicator1.classList.toggle("text-white", firstStep);
            stepIndicator1.classList.toggle("bg-[#dce8e3]", !firstStep);
            stepIndicator1.classList.toggle("text-[#49665f]", !firstStep);

            stepIndicator2.classList.toggle("bg-[#166451]", !firstStep);
            stepIndicator2.classList.toggle("text-white", !firstStep);
            stepIndicator2.classList.toggle("bg-[#dce8e3]", firstStep);
            stepIndicator2.classList.toggle("text-[#49665f]", firstStep);
        }
    }

    formStep1.addEventListener("submit", (event) => {
        event.preventDefault();

        if (!formStep1.reportValidity()) return;

        showStep(2);
    });

    if (backButton) {
        backButton.addEventListener("click", () => showStep(1));
    }

    formStep2.addEventListener("submit", async (event) => {
        event.preventDefault();

        if (!formStep2.reportValidity()) return;

        const submitButton = formStep2.querySelector(
            'button[type="submit"]'
        );

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = "Enviando...";
        }

    const csrfInput = formStep2.querySelector(
    'input[name="csrf_token"]'
    );

    const data = new URLSearchParams({
    nombre: nameInput.value.trim(),
    correo: emailInput.value.trim(),
    telefono: phoneInput.value.trim(),
    motivo: subjectInput.value,
    mensaje: messageInput.value.trim(),
    csrf_token: csrfInput ? csrfInput.value : ""
    });

        try {
            const response = await fetch("/contactos", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
                },
                body: data
            });

            const result = await response.json();

            if (!response.ok || !result.ok) {
                const details = result.errors
                    ? Object.values(result.errors).join("\n")
                    : result.error || "No se pudo enviar el mensaje.";

                alert(details);
                return;
            }

            formStep1.classList.add("hidden");
            formStep2.classList.add("hidden");

            const indicators = document.querySelector(
                "#contact-step-1"
            )?.parentElement;

            if (indicators) indicators.classList.add("hidden");
            if (successMessage) successMessage.classList.remove("hidden");
        } catch (error) {
            console.error("Error al enviar el formulario:", error);
            alert("No se pudo conectar con el servidor. Inténtalo nuevamente.");
        } finally {
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = "Enviar mensaje";
            }
        }
    });
});
