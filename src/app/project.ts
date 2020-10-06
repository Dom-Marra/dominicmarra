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

export interface ProjectObject {
    name: string;
    caption: string;
    thumbnail: File | string; 
    color: String;
    description: string;
    images: Array<File> | Array<string>;
    technologies: Array<Technologies>;
    projectLink?: String;
    gitHubLink?: String;
}

export class Project {

    
    constructor(public projectObj: ProjectObject) { }

    /**
     * Returns the name of the project
     * 
     * @returns String
     */
    public getName(): String {
        return this.projectObj.name;
    }

    /**
     * Returns the caption of the project
     * 
     * @returns String
     */
    public getCaption(): String {
        return this.projectObj.caption;
    }

    /**
     * Returns the thumbnail URL of the project
     * 
     * @returns URL as String
     */
    public getThumbnail(): File | String {
        return this.projectObj.thumbnail;
    }

    /**
     * Returns the color of the project
     * 
     * @returns URL as String
     */
    public getColor(): String {
        return this.projectObj.color;
    }


    /**
     * Returns the description of the project
     * 
     * @returns String
     */
    public getDescription(): String {
        return this.projectObj.description;
    }

    /**
     * Returns the image URLs of the project
     * 
     * @returns URLs as an Array of Strings
     */
    public getImages(): Array<File | String> {
        return this.projectObj.images;
    }

    /**
     * Returns the asscociated icon for the supplied enum
     * 
     * @param tech 
     *          enum
     */
    public getTechnologyIcon(tech: Technologies | String): any {
        let icon: any;
        
        switch(tech) {
            case Technologies.HTML || 'HTML': {
                icon = faHtml5;
                break;
            }
            case Technologies.CSS || 'CSS': {
                icon = faCss3;
                break;
            }
            case Technologies.SCSS || 'SCSS': {

                break;
            }
            case Technologies.Sass || 'Sass': {

                break;
            }
            case Technologies.JS || 'JS': {
                icon = faJs;
                break;
            }
            case Technologies.TS || 'TS': {

                break;
            }
            case Technologies.jQuery || 'jQuery': {

                break;
            }
            case Technologies.Bootstrap || 'Bootstrap': {
                icon = faBootstrap;
                break;
            }
            case Technologies.Firebase || 'Firebase': {

                break;
            }
            case Technologies.pHp || 'pHp': {
                icon = faPhp;
                break;
            }
            case Technologies.Angular || 'Angular': {
                icon = faAngular;
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

        if (this.projectObj.technologies.length > 0) {
            this.projectObj.technologies.forEach(tech => {
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
        return this.projectObj.projectLink;
    }

    /**
     * Returns the git hub link of the project
     * 
     * @returns String
     */
    public getGithubLink(): String {
        return this.projectObj.gitHubLink;
    }
    
}
