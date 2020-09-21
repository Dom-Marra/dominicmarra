import { faAngular, faJs, faHtml5, faCss3, faPhp, faBootstrap } from '@fortawesome/free-brands-svg-icons';

export enum Technologies {
    HTML,
    CSS,
    SCSS,
    Sass,
    JS,
    TS,
    jQuery,
    pHp,
    Bootstrap,
    Firebase,
    Angular
}

export class Project {

    private readonly faAngular = faAngular;
    private readonly faJs = faJs;
    private readonly faHtml5 = faHtml5;
    private readonly faCss3 = faAngular;
    private readonly faPhp = faPhp;
    private readonly faBootstrap = faBootstrap;
    
    
    constructor(private name: string, 
                private caption: string, 
                private thumbnail: string, 
                private color: String,
                private description: string, 
                private images: Array<string>,
                private technologies: Array<Technologies>,
                private projectLink: String,
                private gitHubLink: String,
                private font: String) { 
    }

    /**
     * Returns the name of the project
     * 
     * @returns String
     */
    public getName(): String {
        return this.name;
    }

    /**
     * Returns the caption of the project
     * 
     * @returns String
     */
    public getCaption(): String {
        return this.caption;
    }

    /**
     * Returns the thumbnail URL of the project
     * 
     * @returns URL as String
     */
    public getThumbnail(): String {
        return this.thumbnail;
    }

    /**
     * Returns the color of the project
     * 
     * @returns URL as String
     */
    public getColor(): String {
        return this.color;
    }


    /**
     * Returns the description of the project
     * 
     * @returns String
     */
    public getDescription(): String {
        return this.description;
    }

    /**
     * Returns the image URLs of the project
     * 
     * @returns URLs as an Array of Strings
     */
    public getImages(): Array<String> {
        return this.images;
    }

    /**
     * Returns the asscociated icon for the supplied enum
     * 
     * @param tech 
     *          enum
     */
    public getTechnologyIcon(tech: Technologies): any {
        let icon: any;

        switch(+tech) {
            case Technologies.HTML: {
                icon = this.faHtml5;
                break;
            }
            case Technologies.CSS: {
                icon = this.faCss3;
                break;
            }
            case Technologies.SCSS: {

                break;
            }
            case Technologies.Sass: {

                break;
            }
            case Technologies.JS: {
                icon = this.faJs;
                break;
            }
            case Technologies.TS: {

                break;
            }
            case Technologies.jQuery: {

                break;
            }
            case Technologies.Bootstrap: {
                icon = this.faBootstrap;
                break;
            }
            case Technologies.Firebase: {

                break;
            }
            case Technologies.pHp: {
                icon = this.faPhp;
                break;
            }
            case Technologies.Angular: {
                icon = this.faAngular;
                break;
            }
        }

        return icon;
    }

    /**
     * Returns the technology icons of the project
     * 
     * @returns Array of font awesome icons
     */
    public getTechnologyIcons(): Array<any> {

        var icons = [];

        if (this.technologies.length > 0) {
            this.technologies.forEach(tech => {
                icons.push(this.getTechnologyIcon(tech));
            })
        }

        return icons;
    }

    /**
     * Returns the project link of the project
     * 
     * @returns String
     */
    public getProjectLink(): String {
        return this.projectLink;
    }

    /**
     * Returns the git hub link of the project
     * 
     * @returns String
     */
    public getGithubLink(): String {
        return this.gitHubLink;
    }

    /**
     * Returns the url of the font to use for the projects header
     * 
     * @returns Url as String
     */
    public getFont(): String {
        return this.font;
    }




}
