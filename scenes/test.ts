import { SceneFactory } from '../constructors/factory'

const sceneFactory = new SceneFactory()

window.onresize = () => {
  sceneFactory.setSize(window.innerWidth, window.innerHeight)
}

export default sceneFactory
