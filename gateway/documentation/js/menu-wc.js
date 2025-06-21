'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">gateway documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-bs-toggle="collapse" ${ isNormalMode ?
                                'data-bs-target="#modules-links"' : 'data-bs-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-AppModule-202b0039867e7ae0a305ac1a14a80d8397791019b818c211703fc3e7bab9d905861a4eae47d07a079aa7536d4b155450976b1d6b6ccb22eeca098dad2d4b3fcd"' : 'data-bs-target="#xs-controllers-links-module-AppModule-202b0039867e7ae0a305ac1a14a80d8397791019b818c211703fc3e7bab9d905861a4eae47d07a079aa7536d4b155450976b1d6b6ccb22eeca098dad2d4b3fcd"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AppModule-202b0039867e7ae0a305ac1a14a80d8397791019b818c211703fc3e7bab9d905861a4eae47d07a079aa7536d4b155450976b1d6b6ccb22eeca098dad2d4b3fcd"' :
                                            'id="xs-controllers-links-module-AppModule-202b0039867e7ae0a305ac1a14a80d8397791019b818c211703fc3e7bab9d905861a4eae47d07a079aa7536d4b155450976b1d6b6ccb22eeca098dad2d4b3fcd"' }>
                                            <li class="link">
                                                <a href="controllers/AppController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-AppModule-202b0039867e7ae0a305ac1a14a80d8397791019b818c211703fc3e7bab9d905861a4eae47d07a079aa7536d4b155450976b1d6b6ccb22eeca098dad2d4b3fcd"' : 'data-bs-target="#xs-injectables-links-module-AppModule-202b0039867e7ae0a305ac1a14a80d8397791019b818c211703fc3e7bab9d905861a4eae47d07a079aa7536d4b155450976b1d6b6ccb22eeca098dad2d4b3fcd"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AppModule-202b0039867e7ae0a305ac1a14a80d8397791019b818c211703fc3e7bab9d905861a4eae47d07a079aa7536d4b155450976b1d6b6ccb22eeca098dad2d4b3fcd"' :
                                        'id="xs-injectables-links-module-AppModule-202b0039867e7ae0a305ac1a14a80d8397791019b818c211703fc3e7bab9d905861a4eae47d07a079aa7536d4b155450976b1d6b6ccb22eeca098dad2d4b3fcd"' }>
                                        <li class="link">
                                            <a href="injectables/AppService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AuthModule.html" data-type="entity-link" >AuthModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-AuthModule-5453761cc8090f52a8532f341945e83c7a3df169dc1e5e04bb44a9b040a600f6c9579ea67b35d1cad37bf593e8860cb285af5b0567e96d074ad1146d7dbe0908"' : 'data-bs-target="#xs-controllers-links-module-AuthModule-5453761cc8090f52a8532f341945e83c7a3df169dc1e5e04bb44a9b040a600f6c9579ea67b35d1cad37bf593e8860cb285af5b0567e96d074ad1146d7dbe0908"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AuthModule-5453761cc8090f52a8532f341945e83c7a3df169dc1e5e04bb44a9b040a600f6c9579ea67b35d1cad37bf593e8860cb285af5b0567e96d074ad1146d7dbe0908"' :
                                            'id="xs-controllers-links-module-AuthModule-5453761cc8090f52a8532f341945e83c7a3df169dc1e5e04bb44a9b040a600f6c9579ea67b35d1cad37bf593e8860cb285af5b0567e96d074ad1146d7dbe0908"' }>
                                            <li class="link">
                                                <a href="controllers/AuthController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthController</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#classes-links"' :
                            'data-bs-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/ConfirmDto.html" data-type="entity-link" >ConfirmDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/RegisterDto.html" data-type="entity-link" >RegisterDto</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#miscellaneous-links"'
                            : 'data-bs-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank" rel="noopener noreferrer">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});