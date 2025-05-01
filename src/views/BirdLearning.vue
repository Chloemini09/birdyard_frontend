<template>
    <div class="Bird-learning-container">
        <!-- Header Banner -->
        <div class="banner">
            <h1 class="banner-title">BIRD-LEARNING HUB</h1>
            <p class="banner-subtitle">READ ARTICLES AND WATCH VEDIOS</p>
            <p class="banner-subtitle">LEARN ABOUT BIRD CONSERVATION IN AUSTRALIA</p>
            <p class="banner-subtitle">ENJOY YOUR LEARNING JOURNEY!</p>
        </div>
        <!-- Information Section with Modal Popups About Bird Article -->
        <section class="info-section">
            <div class="container">
                <h2 id="info-title" class="info-title">BIRD-LEARNING ARTICLE</h2>
                <p class="info-subtitle">Click "learn more" or picture to see details.</p>

                <!-- article 1 -->
                <div class="info-card-container">
                    <div class="info-card">
                        <div class="card-image" @click="openExternalLink1">
                            <img src="@/assets/images/bird-article1.png" alt="bird article 1" />
                            <div class="card-overlay">
                                <h3>Birds Red Hot List:</h3>
                                <span class="learn-more">Learn More</span>
                            </div>
                        </div>
                    </div>

                    <transition name="fade">
                        <div class="info-panel">
                            <h1>Birds Red Hot List:
                                The Australian birds most at risk of extinction </h1>
                            <h3>Abstract</h3>
                            <p>
                                (correct)This research report, supported by Australia’s National Environmental Science
                                Program, brings together insights from bird conservation experts and provides the first
                                assessment of the Australian bird species most likely to become extinct in the next 20
                                years. The report warns that without more effective management efforts, up to 10
                                additional bird species could become extinct by 2038. Most high-risk species are found
                                on islands or in the heavily developed regions of southern Australia. The report
                                highlights that early identification of at-risk species and the implementation of
                                targeted actions are crucial to preventing future extinctions.

                            </p>
                            <h3>Reference</h3>
                            <cite>
                                Garnett, S. T., & The NESP Threatened Species Recovery Hub. (n.d.). Birds Red Hot
                                List:
                                The Australian birds most at risk of extinction (Project 2.1, Research findings
                                factsheet). National Environmental Science Program.
                            </cite>
                        </div>
                    </transition>
                </div>

                <!-- article 2 -->
                <div class="info-card-container birds-container">
                    <div class="info-card">
                        <div class="card-image" @click="openExternalLink2">
                            <img src="@/assets/images/bird-article2.png" alt="bird article 2" />
                            <div class="card-overlay">
                                <h3>How are Australian Birds Protected by Law?</h3>
                                <span class="learn-more">Learn More</span>
                            </div>
                        </div>
                    </div>

                    <transition name="fade">
                        <div class="info-panel">
                            <h1>
                                How are Australian Birds
                                Protected by Law?
                            </h1>
                            <h3>Abstract</h3>
                            <p>
                                This PDF provides a brief overview of the legal framework protecting birds in Australia.
                                It emphasizes that mistreating, hunting, or harming wild birds—as well as destroying
                                nests and habitats—is prohibited. The document lists relevant laws at both the federal
                                and state/territory levels, such as the Environment Protection and Biodiversity
                                Conservation Act (EPBC Act) and various Wildlife and Nature Conservation Acts. It
                                highlights how Australia uses legislation across multiple levels to safeguard native
                                bird species and their ecosystems.
                            </p>
                            <h3>Reference</h3>
                            <cite>
                                Birds in Backyards. (n.d.). How are Australian birds protected by law? [Case study PDF].
                                https://www.birdsinbackyards.net/sites/www.birdsinbackyards.net/files/page/attachments/Birds-Law-Casestudy_0.pdf
                            </cite>
                        </div>
                    </transition>
                </div>
                <!-- article 3 -->
                <div class="info-card-container">
                    <div class="info-card">
                        <div class="card-image" @click="openExternalLink3">
                            <img src="@/assets/images/bird-article3.png" alt="bird article 3" />
                            <div class="card-overlay">
                                <h3>Land of the Birds: What Sets Australia's Avian Life Apart?</h3>
                                <span class="learn-more">Learn More</span>
                            </div>
                        </div>
                    </div>

                    <transition name="fade">
                        <div class="info-panel">
                            <h1>
                                Land of the Birds
                            </h1>
                            <h3>Abstract</h3>
                            <p>
                                published by the Royal Society of Victoria, explores the uniqueness of Australia's
                                birdlife. With over 830 species—about 45% of which are endemic—the article highlights
                                the country's vibrant bird species such as parrots and kingfishers, large flightless
                                birds like emus and cassowaries, and the complex intelligence and social behavior of
                                many native birds. It also discusses their distinct evolutionary history shaped by
                                Australia's long geographic isolation, and how they've adapted to diverse environments
                                ranging from arid deserts to tropical rainforests. The article calls for greater
                                awareness and protection of these unique species in the face of threats like habitat
                                loss and changing fire patterns.
                            </p>
                            <h3>Reference</h3>
                            <cite>
                                Royal Society of Victoria. (n.d.). Land of the Birds: What Sets Australia's Avian Life
                                Apart? Retrieved April 30, 2025, from https://rsv.org.au/land-of-birds/
                            </cite>
                        </div>
                    </transition>
                </div>
            </div>
        </section>
        <!-- Information Section with Modal Popups About Bird Vedio -->
        <section class="info-section">
            <div class="container">
                <h2 id="info-title" class="info-title">BIRD-LEARNING VEDIO</h2>
                <p class="info-subtitle">Click "learn more" or picture to see details.</p>

                <!-- vedio 1 -->
                <div class="info-card-container">
                    <div class="info-card">
                        <div class="card-image" @click="openExternalLinkV1">
                            <img src="@/assets/images/bird-vedio1.png" alt="bird vedio 1" />
                            <div class="card-overlay">
                                <h3>Australian Small Birds</h3>
                                <span class="learn-more">Learn More</span>
                            </div>
                        </div>
                    </div>

                    <transition name="fade">
                        <div class="info-panel">
                            <h1>Australian Small Birds </h1>
                            <h3>Abstract</h3>
                            <p>
                                The documentary showcases various small bird species in Australia, highlighting their
                                unique behaviors, habitats, and characteristics. From the intricate courtship displays
                                of male bowerbirds to the vibrant colors of honeyeaters, it captures the diversity and
                                beauty of these avian creatures across different environments, emphasizing their
                                ecological significance.
                            </p>
                            <h3>Uploader</h3>
                            <cite>
                                Stash - Free Documentaries
                            </cite>
                            <h3>Platform</h3>
                            <cite>
                                YouTube
                            </cite>
                            <h3>Upload Time</h3>
                            <cite>
                                31 Oct 2023
                            </cite>
                        </div>
                    </transition>
                </div>

                <!-- vedio 2 -->
                <div class="info-card-container birds-container">
                    <div class="info-card">
                        <div class="card-image" @click="openExternalLinkV2">
                            <img src="@/assets/images/bird-vedio2.png" alt="bird vedio 2" />
                            <div class="card-overlay">
                                <h3>How Smart Are Australia's Ravens? </h3>
                                <span class="learn-more">Learn More</span>
                            </div>
                        </div>
                    </div>

                    <transition name="fade">
                        <div class="info-panel">
                            <h1>How Smart Are Australia's Ravens? </h1>
                            <h3>Abstract</h3>
                            <p>
                                This video showcases five corvid species found in Australia. It outlines the differences
                                between them and delves into the strange behaviors of ravens. While there are many eerie
                                legends surrounding these birds, not all of them are gloomy. Ravens, in particular,
                                display remarkable intelligence—comparable to that of a seven-year-old child.
                            </p>
                            <h3>Uploader</h3>
                            <cite>
                                The Backyard Naturalist
                            </cite>
                            <h3>Platform</h3>
                            <cite>
                                YouTube
                            </cite>
                            <h3>Upload Time</h3>
                            <cite>
                                7 Jan 2024
                            </cite>
                        </div>
                    </transition>
                </div>
            </div>
        </section>
    </div>

</template>

<script>
export default {
    methods: {
        openExternalLink1() {
            window.open(
                'https://www.nespthreatenedspecies.edu.au/media/e4xicyyb/red-hot-list-birds-findings-factsheet.pdf',
                '_blank'
            );
        },
        openExternalLink2() {
            window.open(
                'https://www.birdsinbackyards.net/sites/www.birdsinbackyards.net/files/page/attachments/Birds-Law-Casestudy_0.pdf',
                '_blank'
            );
        },
        openExternalLink3() {
            window.open(
                'https://rsv.org.au/land-of-birds/?srsltid=AfmBOopewcK1OvKdLLPTLPwcXlq_iKUq094t2aDh_GcOy0n1HCqiw-aS',
                '_blank'
            );
        },
        openExternalLinkV1() {
            window.open(
                'https://www.youtube.com/watch?v=KXIbwKkXe70',
                '_blank'
            );
        },
        openExternalLinkV2() {
            window.open(
                'https://www.youtube.com/watch?v=HXgaz4QA2Ek&t=4s',
                '_blank'
            );
        },
    }
}
</script>


<style scoped>
/* Global styles homepage */
.container {
    max-width: 1200px;
    top: 0;
    margin: 0 auto;
    padding: 0 20px;
}

/* Global styles matching your existing site */
.Bird-learning-container {
    width: 100%;
    min-height: 100vh;
    font-family: Arial, sans-serif;
    background-color: #f9f7f0;
}

/* Banner styles */
.banner {
    background-image:
        linear-gradient(rgba(0, 50, 0, 0.8), rgba(0, 50, 0, 0.6)), url('@/assets/images/garden.jpeg');
    background-size: cover;
    background-position: center;
    height: 400px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: white;
    text-align: center;
    padding: 40px;
}

.banner-title {
    font-size: 3.5rem;
    font-weight: bold;
    margin-bottom: 10px;
}

.banner-subtitle {
    font-size: 1.2rem;
}

/* Info Section Styles */
.info-section {
    padding: 50px 0;
    background-color: #f9f7f0;
}

.info-title {
    font-size: 2.2rem;
    text-align: center;
    margin-bottom: 20px;
    color: #0a3200;
}

.info-subtitle {
    font-size: 1.2rem;
    text-align: center;
    margin-bottom: 20px;
    color: #0a3200;
}

.info-card-container {
    display: flex;
    max-height: 500px;
    margin-bottom: 80px;
    align-items: flex-start;
    gap: 40px;
}

.birds-container {
    flex-direction: row-reverse;
}

.info-card {
    flex: 0 0 50%;
    max-width: 500px;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    transition:
        transform 0.3s ease,
        box-shadow 0.3s ease;
}

.info-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

.card-image {
    position: relative;
    height: 500px;
    cursor: pointer;
    overflow: hidden;
}

.card-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
}

.info-card:hover .card-image img {
    transform: scale(1.05);
}

.card-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: linear-gradient(transparent, rgba(10, 50, 0, 0.8));
    padding: 25px;
    color: white;
    transition: background 0.3s ease;
}

.card-overlay h3 {
    margin-bottom: 10px;
    font-size: 1.5rem;
    font-weight: 600;
}

.learn-more {
    display: inline-flex;
    align-items: center;
    font-weight: 700;
    color: white;
    background-color: rgba(0, 0, 0, 0.4);
    border-radius: 20px;
    padding: 6px 14px;
    font-size: 0.95rem;
    transition: all 0.3s ease;
    cursor: pointer;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

.learn-more::after {
    content: '+';
    display: inline-block;
    margin-left: 8px;
    font-size: 16px;
    font-weight: bold;
    transition: transform 0.3s ease;
}

.card-image:hover .learn-more {
    background-color: white;
    color: #0a3200;
}

.card-image:hover .learn-more::after {
    transform: translateX(3px);
}

.card-image:hover .card-overlay {
    background: linear-gradient(transparent, rgba(10, 50, 0, 0.9));
}

.card-image:hover .learn-more {
    transform: translateX(5px);
}

.card-image:hover .learn-more::after {
    transform: rotate(90deg);
}

/* Info Panel Styles */
.info-panel {
    background-color: #f0f0f0;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
    position: relative;
    border-left: 4px solid #c2e59c;
    height: 500px;
    overflow-y: auto;
    overflow-x: hidden;
}

.info-panel h3 {
    color: #0a3200;
    margin-top: 0;
    margin-bottom: 15px;
    font-size: 1.4rem;
}

.info-panel h3:not(:first-child) {
    margin-top: 25px;
}

.info-panel p {
    margin-bottom: 15px;
    line-height: 1.6;
    font-size: 1.1rem;
}

.info-panel ul {
    margin-bottom: 20px;
    padding-left: 20px;
}

.info-panel li {
    margin-bottom: 12px;
    line-height: 1.6;
}

.info-link {
    display: inline-block;
    margin-top: 15px;
    color: #0a3200;
    font-weight: 600;
    text-decoration: none;
    border-bottom: 2px solid #c2e59c;
    padding-bottom: 2px;
    transition: all 0.3s ease;
}

.info-link:hover {
    color: #4a7d32;
    transform: translateX(5px);
}
</style>