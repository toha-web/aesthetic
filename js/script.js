// Mobile menu control
function toggleMobileMenu() {
    document.querySelector(".burger").classList.toggle("active");
    document.querySelector(".menu").classList.toggle("active");
    document.querySelector("body").classList.toggle("locked");
}
document.querySelector(".menu-icon").addEventListener("click", () => {
    toggleMobileMenu();
});
document.querySelectorAll(".menu li").forEach((link) => {
    link.addEventListener("click", () => {
        toggleMobileMenu();
    });
});


// Slider
const projectTitle = document.querySelector(".project-title");
const projectDescription = document.querySelector(".project-description");
const projectSquare = document.querySelector(".project-params > div:nth-of-type(1)");
const projectTime = document.querySelector(".project-params > div:nth-of-type(2)");
const projectFor = document.querySelector(".project-params > div:nth-of-type(3)");

const projectImageSlider = document.querySelector(".project-slider-image");
const projectCurrentImage = document.querySelector(".project-slider-image img");

const buttonPrev = document.querySelector(".button-prev");
const buttonNext = document.querySelector(".button-next");

let projects = [];
let index = 0;
let prevIndex;

async function getSliderData() {
    const response = await fetch("./js/data.json");
    projects = await response.json();
    sliderInit(projects, index);
    if(projects.length > 1){
        buttonNext.classList.remove("disabled");
        projectCurrentImage.classList.add("active");
    }
}
getSliderData();

function cutDescription(string){
    if (window.innerWidth >= 960 && window.innerWidth < 1200 && string.length > 450) {
        return string.slice(0, 450).split(".").slice(0, -1).join(".") + ".";
    }
    else if (window.innerWidth >= 1200 && string.length > 520) {
        return string.slice(0, 520).split(".").slice(0, -1).join(".") + ".";
    } else {
        return string;
    }
}

function sliderInit(projects = [], activeIndex = 0) {
    if(activeIndex >= projects.length || activeIndex < 0) return;

    if (projects.length > 0) {
        projectTitle.querySelector("span").classList.add("old");
        projectDescription.querySelector("span").classList.add("old");
        projectSquare.querySelector("span").classList.add("old");
        projectTime.querySelector("span").classList.add("old");
        projectFor.querySelector("span").classList.add("old");

        setTimeout(() => {
            projectTitle.replaceChildren();
            projectTitle.insertAdjacentHTML("afterbegin", `<span>${projects[activeIndex].title}</span>`);

            projectDescription.replaceChildren();
            projectDescription.insertAdjacentHTML("afterbegin", `<span>${cutDescription(projects[activeIndex].description)}</span>`);

            projectSquare.replaceChildren();
            projectSquare.insertAdjacentHTML("afterbegin", `<span>${projects[activeIndex].square} m<sup>2</sup></span>`);

            projectTime.replaceChildren();
            projectTime.insertAdjacentHTML("afterbegin", `<span>${projects[activeIndex].time}</span>`);

            projectFor.replaceChildren();
            projectFor.insertAdjacentHTML("afterbegin", `<span>${projects[activeIndex].for}</span>`);
        }, 600);
    }

    if((!prevIndex || activeIndex > prevIndex) && activeIndex + 1 <= projects.length - 1) {
        const nextImg = document.createElement("img");
        nextImg.classList.add("next");
        nextImg.src = projects[activeIndex + 1].image;
        nextImg.alt = projects[activeIndex + 1].title;
        projectImageSlider.append(nextImg);
    }
    else if(activeIndex < prevIndex && activeIndex - 1 >= 0){
        const prevImg = document.createElement("img");
        prevImg.classList.add("prev");
        prevImg.src = projects[activeIndex - 1].image;
        prevImg.alt = projects[activeIndex - 1].title;
        projectImageSlider.prepend(prevImg);
    }

    prevIndex = activeIndex;

    window.addEventListener("resize", (e) => {
        projectDescription.replaceChildren();
        projectDescription.insertAdjacentHTML("afterbegin", `<span>${cutDescription(projects[activeIndex].description)}</span>`);
    });
};

buttonPrev.addEventListener("click", () => {
    if(window.innerWidth <= 768){
        sliderPositioning();
    }
    index --;
    if(index < projects.length - 1){
        buttonNext.classList.remove("disabled");
    }
    if(index === 0){
        buttonPrev.classList.add("disabled");
    }

    document.querySelector(".project-slider-image img.next")?.remove();
    document.querySelector(".project-slider-image img.active").className = "next";
    document.querySelector(".project-slider-image img.prev").className = "active";

    sliderInit(projects, index);
});
buttonNext.addEventListener("click", () => {
    if(window.innerWidth <= 768){
        sliderPositioning();
    }
    index ++;
    if(index > 0){
        buttonPrev.classList.remove("disabled");
    }
    if(index === projects.length - 1){
        buttonNext.classList.add("disabled");
    }

    document.querySelector(".project-slider-image img.prev")?.remove();
    document.querySelector(".project-slider-image img.active").className = "prev";
    document.querySelector(".project-slider-image img.next").className = "active";

    sliderInit(projects, index);
});

function sliderPositioning(){
    const position = document.querySelector(".project-slider-image").getBoundingClientRect().top + window.scrollY;    
    window.scrollTo({ top: parseInt(position), behavior: "smooth" });
}

// Image Gallery
document.querySelector(".gallery-container").addEventListener("click", (e) => {
    if(e.target.tagName.toLowerCase() === "img"){
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
        const img = e.target;
        const popup = document.createElement("div");
        const popupImg = document.createElement("img");
        popupImg.src = img.src;
        
        Object.assign(popupImg.style, {
            width: "100%",
            height: "100%",
            objectFit: "cover"
        });

        Object.assign(popup.style, {
            position: "fixed",
            top: `${e.clientY}px`,
            left: `${e.clientX}px`,
            transform: "translate(-50%, -50%) scale(0)",
            transformOrigin: "center",
            maxWidth: "800px",
            maxHeight: "95vh",
            width: "100%",
            border: "3px solid white",
            borderRadius: "30px",
            aspectRatio: "800 / 600",
            overflow: "hidden"
        });
        popup.animate(
            [
                {
                    top: `${e.clientY}px`,
                    left: `${e.clientX}px`,
                    transform: "translate(-50%, -50%) scale(0)",
                },
                {
                    top: `${window.innerHeight / 2}px`,
                    left: `${window.innerWidth / 2}px`,
                    transform: "translate(-50%, -50%) scale(1)",
                },
            ],
            {
                duration: 500,
                fill: "forwards",
                easing: "ease-out",
            }
        );

        setTimeout(() => {
            document.addEventListener("click", function (e) {
                if (popup.isConnected) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    popup.remove();
                    document.querySelector("body").classList.remove("locked");
                    document.body.style.paddingRight = "";
                }
            }, true);
        }, 500);
        
        document.querySelector("body").classList.add("locked");
        document.body.style.paddingRight = `${scrollbarWidth}px`;

        popup.append(popupImg);
        document.body.append(popup);
    }
})