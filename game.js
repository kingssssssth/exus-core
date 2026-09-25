import { playSound, startAmbient, stopSound } from "./sounds.js";
import { Zombie } from "./zombies.js";

import * as THREE from "three";
import { PointerLockControls } from "three/addons/controls/PointerLockControls.js";
import { CollisionSystem } from "./collision.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";


// =====================================================
// ESCENA
// =====================================================

const scene = new THREE.Scene();

scene.background = new THREE.Color(0x182127);

scene.fog = new THREE.Fog(
    0x182127,
    35,
    180
);


// =====================================================
// CÁMARA
// =====================================================

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    500
);

camera.position.set(0, 2, 20);


// =====================================================
// RENDER
// =====================================================

const renderer = new THREE.WebGLRenderer({
    antialias: true
});

renderer.setSize(
    window.innerWidth,
    window.innerHeight
);

renderer.setPixelRatio(
    Math.min(window.devicePixelRatio, 2)
);

renderer.shadowMap.enabled = true;

renderer.shadowMap.type =
    THREE.PCFSoftShadowMap;

renderer.outputColorSpace =
    THREE.SRGBColorSpace;

renderer.toneMapping =
    THREE.ACESFilmicToneMapping;

renderer.toneMappingExposure =
    1.25;

document.body.appendChild(
    renderer.domElement
);


// =====================================================
// COLISIONES
// =====================================================

const collisions =
    new CollisionSystem(0.45);


// =====================================================
// LUCES
// =====================================================

const ambientLight =
    new THREE.HemisphereLight(
        0xffffff,
        0x404040,
        2.2
    );

scene.add(ambientLight);


const sun =
    new THREE.DirectionalLight(
        0xffffff,
        3.2
    );

sun.position.set(
    30,
    60,
    20
);

sun.castShadow = true;

sun.shadow.mapSize.width = 2048;
sun.shadow.mapSize.height = 2048;

sun.shadow.camera.left = -100;
sun.shadow.camera.right = 100;
sun.shadow.camera.top = 100;
sun.shadow.camera.bottom = -100;

scene.add(sun);


const cityLight =
    new THREE.PointLight(
        0x88aaff,
        3,
        100
    );

cityLight.position.set(
    0,
    30,
    0
);

scene.add(cityLight);


// =====================================================
// CONTROLES
// =====================================================

const controls =
    new PointerLockControls(
        camera,
        document.body
    );

document.addEventListener(
    "click",
    () => {

        if (!controls.isLocked) {

            controls.lock();

            startAmbient();

        }

    }
);


// =====================================================
// PISO
// =====================================================

const floorGeometry =
    new THREE.BoxGeometry(
        150,
        1,
        150
    );

const floorMaterial =
    new THREE.MeshStandardMaterial({
        color: 0x3d4245,
        roughness: 0.95
    });

const floor =
    new THREE.Mesh(
        floorGeometry,
        floorMaterial
    );

floor.position.y = -0.5;

floor.receiveShadow = true;

scene.add(floor);


// =====================================================
// EDIFICIOS BASE
// =====================================================

function building(
    x,
    z,
    width,
    height,
    depth
) {

    const geometry =
        new THREE.BoxGeometry(
            width,
            height,
            depth
        );

    const material =
        new THREE.MeshStandardMaterial({
            color: 0x555b60,
            roughness: 0.95
        });

    const object =
        new THREE.Mesh(
            geometry,
            material
        );

    object.position.set(
        x,
        height / 2,
        z
    );

    object.castShadow = true;
    object.receiveShadow = true;

    scene.add(object);

    collisions.addBox(
        x,
        z,
        width,
        depth
    );
}


building(-25, -25, 20, 15, 20);
building(25, -25, 25, 20, 20);
building(-25, 25, 22, 18, 25);
building(25, 25, 20, 14, 20);
building(-55, 0, 20, 25, 25);
building(55, 0, 20, 22, 25);


// =====================================================
// CAJAS
// =====================================================

function box(x, z) {

    const geometry =
        new THREE.BoxGeometry(
            3,
            3,
            3
        );

    const material =
        new THREE.MeshStandardMaterial({
            color: 0x80542e,
            roughness: 1
        });

    const object =
        new THREE.Mesh(
            geometry,
            material
        );

    object.position.set(
        x,
        1.5,
        z
    );

    object.rotation.y =
        Math.random() * 0.5;

    object.castShadow = true;
    object.receiveShadow = true;

    scene.add(object);

    collisions.addBox(
        x,
        z,
        3,
        3
    );
}

box(-7, -7);
box(-3, -7);
box(7, 7);
box(11, 7);


// =====================================================
// CARRETERA
// =====================================================

const roadGeometry =
    new THREE.BoxGeometry(
        150,
        0.05,
        12
    );

const roadMaterial =
    new THREE.MeshStandardMaterial({
        color: 0x17191a,
        roughness: 1
    });

const road =
    new THREE.Mesh(
        roadGeometry,
        roadMaterial
    );

road.position.y = 0.03;

scene.add(road);


// =====================================================
// MARCAS DE CARRETERA
// =====================================================

const roadMarkMaterial =
    new THREE.MeshStandardMaterial({
        color: 0xc5c5a8,
        roughness: 0.8
    });

for (
    let x = -65;
    x < 65;
    x += 10
) {

    const mark =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                5,
                0.03,
                0.18
            ),
            roadMarkMaterial
        );

    mark.position.set(
        x,
        0.07,
        0
    );

    scene.add(mark);
}


// =====================================================
// PAREDES
// =====================================================

function wall(
    x,
    z,
    width,
    depth
) {

    const geometry =
        new THREE.BoxGeometry(
            width,
            8,
            depth
        );

    const material =
        new THREE.MeshStandardMaterial({
            color: 0x41474b,
            roughness: 1
        });

    const object =
        new THREE.Mesh(
            geometry,
            material
        );

    object.position.set(
        x,
        4,
        z
    );

    object.castShadow = true;
    object.receiveShadow = true;

    scene.add(object);

    collisions.addBox(
        x,
        z,
        width,
        depth
    );
}

wall(0, -70, 150, 2);
wall(0, 70, 150, 2);
wall(-70, 0, 2, 150);
wall(70, 0, 2, 150);


// =====================================================
// MATERIALES
// =====================================================

const concreteMaterial =
    new THREE.MeshStandardMaterial({
        color: 0x77736b,
        roughness: 1
    });

const darkConcreteMaterial =
    new THREE.MeshStandardMaterial({
        color: 0x353938,
        roughness: 1
    });

const brickMaterial =
    new THREE.MeshStandardMaterial({
        color: 0x714d3b,
        roughness: 1
    });

const metalMaterial =
    new THREE.MeshStandardMaterial({
        color: 0x3b4140,
        metalness: 0.65,
        roughness: 0.8
    });

const woodMaterial =
    new THREE.MeshStandardMaterial({
        color: 0x4b3324,
        roughness: 1
    });

const glassMaterial =
    new THREE.MeshStandardMaterial({
        color: 0x18282d,
        roughness: 0.35,
        metalness: 0.15
    });


// =====================================================
// UTILIDAD
// =====================================================

function addMesh(
    geometry,
    material,
    x,
    y,
    z,
    rotationX = 0,
    rotationY = 0,
    rotationZ = 0
) {

    const object =
        new THREE.Mesh(
            geometry,
            material
        );

    object.position.set(
        x,
        y,
        z
    );

    object.rotation.set(
        rotationX,
        rotationY,
        rotationZ
    );

    object.castShadow = true;
    object.receiveShadow = true;

    scene.add(object);

    return object;
}


// =====================================================
// PUERTA
// =====================================================

function addRuinedDoor(
    x,
    z,
    rotation = 0
) {

    const frameGeometry =
        new THREE.BoxGeometry(
            4.2,
            5.8,
            0.45
        );

    addMesh(
        frameGeometry,
        concreteMaterial,
        x,
        2.9,
        z,
        0,
        rotation,
        0
    );

    const doorGeometry =
        new THREE.BoxGeometry(
            2.8,
            5,
            0.25
        );

    const door =
        addMesh(
            doorGeometry,
            woodMaterial,
            x,
            2.5,
            z - 0.25,
            0,
            rotation,
            0
        );

    door.rotation.z =
        -0.12;

    const handleGeometry =
        new THREE.SphereGeometry(
            0.12,
            8,
            8
        );

    addMesh(
        handleGeometry,
        metalMaterial,
        x + 0.8,
        2.5,
        z - 0.45,
        0,
        rotation,
        0
    );
}


// =====================================================
// VENTANA
// =====================================================

function addBrokenWindow(
    x,
    y,
    z,
    rotation = 0
) {

    const frame =
        addMesh(
            new THREE.BoxGeometry(
                3.6,
                2.8,
                0.25
            ),
            darkConcreteMaterial,
            x,
            y,
            z,
            0,
            rotation,
            0
        );

    frame.scale.set(
        1,
        1,
        0.8
    );

    const glass =
        addMesh(
            new THREE.BoxGeometry(
                2.7,
                2,
                0.08
            ),
            glassMaterial,
            x,
            y,
            z - 0.18,
            0,
            rotation,
            0
        );

    glass.rotation.z =
        0.08;

    for (
        let i = 0;
        i < 4;
        i++
    ) {

        const crack =
            addMesh(
                new THREE.BoxGeometry(
                    0.04,
                    1.5,
                    0.03
                ),
                concreteMaterial,
                x +
                (Math.random() - 0.5) * 2,
                y +
                (Math.random() - 0.5),
                z - 0.25,
                0,
                rotation,
                (Math.random() - 0.5) * 0.8
            );

        crack.scale.y =
            0.5 +
            Math.random();
    }
}


// =====================================================
// LADRILLOS
// =====================================================

function addBrokenBricks(
    x,
    y,
    z,
    amount = 8
) {

    for (
        let i = 0;
        i < amount;
        i++
    ) {

        const geometry =
            new THREE.BoxGeometry(
                0.7 +
                Math.random() * 0.5,

                0.35 +
                Math.random() * 0.2,

                0.3
            );

        addMesh(
            geometry,
            brickMaterial,

            x +
            (Math.random() - 0.5) * 8,

            y +
            (Math.random() - 0.5) * 3,

            z +
            (Math.random() - 0.5) * 0.6,

            Math.random() * 0.3,
            Math.random(),
            Math.random() * 0.5
        );
    }
}


// =====================================================
// VIGA
// =====================================================

function addBeam(
    x,
    y,
    z,
    rotationZ = 0
) {

    const geometry =
        new THREE.BoxGeometry(
            0.35,
            0.35,
            9
        );

    addMesh(
        geometry,
        metalMaterial,
        x,
        y,
        z,
        0,
        0,
        rotationZ
    );
}


// =====================================================
// TUBERÍA
// =====================================================

function addPipe(
    x,
    y,
    z,
    rotationZ = 0
) {

    const geometry =
        new THREE.CylinderGeometry(
            0.14,
            0.14,
            5,
            10
        );

    addMesh(
        geometry,
        metalMaterial,
        x,
        y,
        z,
        0,
        0,
        rotationZ
    );
}


// =====================================================
// ESCOMBROS
// =====================================================

function addDebris(
    x,
    z,
    amount = 15
) {

    for (
        let i = 0;
        i < amount;
        i++
    ) {

        const size =
            0.25 +
            Math.random() * 1.1;

        const geometry =
            new THREE.BoxGeometry(
                size,
                size * 0.6,
                size * 0.7
            );

        const material =
            Math.random() > 0.35
                ? concreteMaterial
                : brickMaterial;

        addMesh(
            geometry,
            material,

            x +
            (Math.random() - 0.5) * 13,

            size * 0.3,

            z +
            (Math.random() - 0.5) * 13,

            Math.random(),
            Math.random(),
            Math.random()
        );
    }
}


// =====================================================
// VEGETACIÓN
// =====================================================

function addDeadPlant(
    x,
    z
) {

    const plantMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x334a35,
            roughness: 1
        });

    const stem =
        addMesh(
            new THREE.CylinderGeometry(
                0.08,
                0.12,
                1.8,
                6
            ),
            plantMaterial,
            x,
            0.9,
            z
        );

    for (
        let i = 0;
        i < 3;
        i++
    ) {

        addMesh(
            new THREE.SphereGeometry(
                0.35,
                6,
                5
            ),
            plantMaterial,

            x +
            (Math.random() - 0.5) * 0.7,

            1.5 +
            Math.random() * 0.6,

            z +
            (Math.random() - 0.5) * 0.7
        );
    }

    return stem;
}


// =====================================================
// LUCES ROJAS
// =====================================================

const ruinLights = [];

function addBrokenLight(
    x,
    y,
    z
) {

    const bulbMaterial =
        new THREE.MeshStandardMaterial({
            color: 0xff3300,
            emissive: 0xff2200,
            emissiveIntensity: 3
        });

    const bulb =
        addMesh(
            new THREE.SphereGeometry(
                0.18,
                8,
                8
            ),
            bulbMaterial,
            x,
            y,
            z
        );

    const light =
        new THREE.PointLight(
            0xff3300,
            1.8,
            8
        );

    light.position.set(
        x,
        y,
        z
    );

    scene.add(light);

    ruinLights.push({
        bulb,
        light,
        offset: Math.random() * 10
    });
}


// =====================================================
// DECORAR RUINA
// =====================================================

function decorateRuin(
    x,
    z,
    width,
    height,
    depth
) {

    addRuinedDoor(
        x,
        z - depth / 2 - 0.35
    );

    const windowCount =
        Math.max(
            2,
            Math.floor(width / 5)
        );

    for (
        let i = 0;
        i < windowCount;
        i++
    ) {

        const windowX =
            x -
            width / 2 +
            3 +
            i * 5;

        addBrokenWindow(
            windowX,
            4,
            z - depth / 2 - 0.2
        );

        if (height > 16) {

            addBrokenWindow(
                windowX,
                9,
                z - depth / 2 - 0.2
            );
        }
    }

    addBrokenBricks(
        x,
        Math.min(height - 2, 9),
        z - depth / 2 - 0.3,
        10
    );

    addBeam(
        x - width / 2 + 2,
        height - 1,
        z,
        0.1
    );

    addBeam(
        x + width / 2 - 2,
        height - 3,
        z,
        -0.15
    );

    addPipe(
        x - width / 2 - 0.5,
        height * 0.55,
        z
    );

    addPipe(
        x + width / 2 + 0.5,
        height * 0.4,
        z + 2
    );

    addDebris(
        x,
        z,
        18
    );

    for (
        let i = 0;
        i < 4;
        i++
    ) {

        addDeadPlant(
            x +
            (Math.random() - 0.5) *
            width,

            z +
            (Math.random() - 0.5) *
            depth
        );
    }

    addBrokenLight(
        x,
        8,
        z - depth / 2 - 0.6
    );
}


// =====================================================
// OBJETO CON COLISIÓN
// =====================================================

function addCollisionObject(
    x,
    z,
    width,
    depth
) {

    collisions.addBox(
        x,
        z,
        width,
        depth
    );
}


// =====================================================
// CARRO ABANDONADO
// =====================================================

function addAbandonedCar(
    x,
    z,
    rotation = 0
) {

    const carGroup =
        new THREE.Group();

    carGroup.position.set(
        x,
        0,
        z
    );

    carGroup.rotation.y =
        rotation;

    scene.add(carGroup);

    const bodyMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x353b3d,
            roughness: 0.85,
            metalness: 0.35
        });

    const body =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                5.5,
                1.2,
                2.5
            ),
            bodyMaterial
        );

    body.position.y = 1;

    body.castShadow = true;
    body.receiveShadow = true;

    carGroup.add(body);


    const roof =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                2.8,
                1,
                2.1
            ),
            bodyMaterial
        );

    roof.position.set(
        -0.2,
        1.9,
        0
    );

    roof.castShadow = true;

    carGroup.add(roof);


    const windowMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x172326,
            roughness: 0.25,
            metalness: 0.2
        });


    const frontWindow =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                1.2,
                0.7,
                2.12
            ),
            windowMaterial
        );

    frontWindow.position.set(
        0.65,
        1.95,
        0
    );

    carGroup.add(frontWindow);


    const wheelMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x111111,
            roughness: 1
        });


    const wheelPositions = [
        [-1.8, 0.65, -1.3],
        [-1.8, 0.65, 1.3],
        [1.8, 0.65, -1.3],
        [1.8, 0.65, 1.3]
    ];


    wheelPositions.forEach(
        position => {

            const wheel =
                new THREE.Mesh(
                    new THREE.CylinderGeometry(
                        0.65,
                        0.65,
                        0.4,
                        16
                    ),
                    wheelMaterial
                );

            wheel.rotation.x =
                Math.PI / 2;

            wheel.position.set(
                position[0],
                position[1],
                position[2]
            );

            wheel.castShadow = true;

            carGroup.add(wheel);
        }
    );


    addCollisionObject(
        x,
        z,
        6,
        3
    );
}


// =====================================================
// CONTENEDOR
// =====================================================

function addContainer(
    x,
    z,
    rotation = 0
) {

    const material =
        new THREE.MeshStandardMaterial({
            color: 0x40524d,
            roughness: 0.9
        });


    const container =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                7,
                3,
                3
            ),
            material
        );

    container.position.set(
        x,
        1.5,
        z
    );

    container.rotation.y =
        rotation;

    container.castShadow = true;
    container.receiveShadow = true;

    scene.add(container);


    for (
        let i = -3;
        i <= 3;
        i++
    ) {

        const line =
            new THREE.Mesh(
                new THREE.BoxGeometry(
                    0.08,
                    2.8,
                    3.05
                ),
                metalMaterial
            );

        line.position.set(
            x + i,
            1.5,
            z
        );

        line.rotation.y =
            rotation;

        scene.add(line);
    }


    addCollisionObject(
        x,
        z,
        7,
        3
    );
}


// =====================================================
// BARRILES
// =====================================================

function addBarrel(
    x,
    z,
    color = 0x39484a
) {

    const material =
        new THREE.MeshStandardMaterial({
            color: color,
            roughness: 0.8,
            metalness: 0.35
        });


    const barrel =
        new THREE.Mesh(
            new THREE.CylinderGeometry(
                0.65,
                0.65,
                1.6,
                16
            ),
            material
        );

    barrel.position.set(
        x,
        0.8,
        z
    );

    barrel.castShadow = true;
    barrel.receiveShadow = true;

    scene.add(barrel);


    addCollisionObject(
        x,
        z,
        1.4,
        1.4
    );
}


// =====================================================
// CAJAS APILADAS
// =====================================================

function addCratePile(
    x,
    z
) {

    for (
        let i = 0;
        i < 5;
        i++
    ) {

        const crate =
            new THREE.Mesh(
                new THREE.BoxGeometry(
                    1.8,
                    1.8,
                    1.8
                ),
                woodMaterial
            );

        const row =
            i % 2;

        crate.position.set(
            x + row * 0.9,
            0.9 +
            Math.floor(i / 2) * 1.8,
            z +
            (row ? 0.4 : 0)
        );

        crate.rotation.y =
            Math.random() * 0.2;

        crate.castShadow = true;
        crate.receiveShadow = true;

        scene.add(crate);
    }


    addCollisionObject(
        x,
        z,
        3.5,
        3
    );
}


// =====================================================
// BARRICADA
// =====================================================

function addBarricade(
    x,
    z,
    rotation = 0
) {

    const group =
        new THREE.Group();

    group.position.set(
        x,
        0,
        z
    );

    group.rotation.y =
        rotation;

    scene.add(group);


    const bar =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                5,
                0.35,
                0.35
            ),
            woodMaterial
        );

    bar.position.y =
        1.3;

    bar.castShadow = true;

    group.add(bar);


    const leg1 =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                0.35,
                2,
                0.35
            ),
            woodMaterial
        );

    leg1.position.set(
        -1.8,
        0.65,
        0
    );

    group.add(leg1);


    const leg2 =
        leg1.clone();

    leg2.position.x =
        1.8;

    group.add(leg2);


    const warningMaterial =
        new THREE.MeshStandardMaterial({
            color: 0xb68a26,
            roughness: 0.8
        });


    const warning =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                5,
                0.18,
                0.45
            ),
            warningMaterial
        );

    warning.position.y =
        1.75;

    group.add(warning);


    addCollisionObject(
        x,
        z,
        5,
        1
    );
}


// =====================================================
// POSTE DE LUZ
// =====================================================

function addStreetPole(
    x,
    z
) {

    const poleMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x292d2d,
            metalness: 0.7,
            roughness: 0.7
        });


    const pole =
        new THREE.Mesh(
            new THREE.CylinderGeometry(
                0.16,
                0.22,
                7,
                10
            ),
            poleMaterial
        );

    pole.position.set(
        x,
        3.5,
        z
    );

    pole.castShadow = true;

    scene.add(pole);


    const arm =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                2.5,
                0.16,
                0.16
            ),
            poleMaterial
        );

    arm.position.set(
        x + 1,
        6.8,
        z
    );

    scene.add(arm);


    const lamp =
        new THREE.Mesh(
            new THREE.SphereGeometry(
                0.28,
                10,
                10
            ),
            new THREE.MeshStandardMaterial({
                color: 0xffffdd,
                emissive: 0xffffaa,
                emissiveIntensity: 3
            })
        );

    lamp.position.set(
        x + 2,
        6.7,
        z
    );

    scene.add(lamp);


    const light =
        new THREE.PointLight(
            0xffe8b0,
            2,
            15
        );

    light.position.set(
        x + 2,
        6.5,
        z
    );

    scene.add(light);


    addCollisionObject(
        x,
        z,
        0.8,
        0.8
    );
}


// =====================================================
// ESCOMBROS GRANDES
// =====================================================

function addRubblePile(
    x,
    z
) {

    for (
        let i = 0;
        i < 18;
        i++
    ) {

        const size =
            0.3 +
            Math.random() * 1.3;

        const rubble =
            new THREE.Mesh(
                new THREE.DodecahedronGeometry(
                    size,
                    0
                ),
                Math.random() > 0.4
                    ? concreteMaterial
                    : brickMaterial
            );

        rubble.position.set(
            x +
            (Math.random() - 0.5) * 7,

            size * 0.35,

            z +
            (Math.random() - 0.5) * 7
        );

        rubble.rotation.set(
            Math.random(),
            Math.random(),
            Math.random()
        );

        rubble.castShadow = true;

        scene.add(rubble);
    }
}


// =====================================================
// ÁRBOL SECO
// =====================================================

function addDeadTree(
    x,
    z
) {

    const treeMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x34291f,
            roughness: 1
        });


    const trunk =
        new THREE.Mesh(
            new THREE.CylinderGeometry(
                0.3,
                0.55,
                5,
                7
            ),
            treeMaterial
        );

    trunk.position.set(
        x,
        2.5,
        z
    );

    trunk.rotation.z =
        (Math.random() - 0.5) * 0.15;

    trunk.castShadow = true;

    scene.add(trunk);


    for (
        let i = 0;
        i < 4;
        i++
    ) {

        const branch =
            new THREE.Mesh(
                new THREE.CylinderGeometry(
                    0.08,
                    0.18,
                    2.5,
                    6
                ),
                treeMaterial
            );

        branch.position.set(
            x +
            (Math.random() - 0.5) * 1.5,

            4 +
            Math.random() * 1.5,

            z +
            (Math.random() - 0.5) * 1.5
        );

        branch.rotation.z =
            Math.random() - 0.5;

        branch.rotation.x =
            Math.random() - 0.5;

        scene.add(branch);
    }


    addCollisionObject(
        x,
        z,
        1.2,
        1.2
    );
}


// =====================================================
// LLANTAS
// =====================================================

function addTirePile(
    x,
    z
) {

    const tireMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x111111,
            roughness: 1
        });


    for (
        let i = 0;
        i < 4;
        i++
    ) {

        const tire =
            new THREE.Mesh(
                new THREE.TorusGeometry(
                    0.65,
                    0.22,
                    8,
                    16
                ),
                tireMaterial
            );

        tire.position.set(
            x,
            0.7 +
            i * 0.55,
            z
        );

        tire.rotation.x =
            Math.PI / 2;

        tire.castShadow = true;

        scene.add(tire);
    }


    addCollisionObject(
        x,
        z,
        1.5,
        1.5
    );
}


// =====================================================
// DECORACIÓN DE EDIFICIOS
// =====================================================

function decorateBuildingSides(
    x,
    z,
    width,
    height,
    depth
) {

    for (
        let i = 0;
        i < 3;
        i++
    ) {

        addBarrel(
            x -
            width / 2 +
            3 +
            i * 2,

            z -
            depth / 2 -
            2
        );
    }


    for (
        let i = 0;
        i < 3;
        i++
    ) {

        addDebris(
            x +
            (i - 1) * 4,

            z +
            depth / 2 +
            2,

            5
        );
    }


    for (
        let i = 0;
        i < 2;
        i++
    ) {

        addBrokenWindow(
            x -
            width / 2 -
            0.15,

            4 +
            i * 5,

            z
        );
    }


    for (
        let i = 0;
        i < 2;
        i++
    ) {

        addPipe(
            x +
            width / 2 +
            0.5,

            4 +
            i * 4,

            z
        );
    }


    addBeam(
        x,
        height - 1,
        z,
        0.25
    );
}


// =====================================================
// RELLENAR CIUDAD
// =====================================================

function fillCity() {

    addAbandonedCar(
        -10,
        -18,
        0.1
    );

    addAbandonedCar(
        12,
        18,
        Math.PI
    );


    addContainer(
        -8,
        16,
        0
    );

    addContainer(
        8,
        -16,
        Math.PI / 2
    );


    addBarrel(
        -14,
        -5
    );

    addBarrel(
        -12,
        -3
    );

    addBarrel(
        14,
        5,
        0x62442d
    );

    addBarrel(
        16,
        5,
        0x62442d
    );


    addCratePile(
        -12,
        10
    );

    addCratePile(
        14,
        -10
    );


    addBarricade(
        -3,
        15,
        0
    );

    addBarricade(
        3,
        -15,
        Math.PI
    );


    addStreetPole(
        -12,
        0
    );

    addStreetPole(
        12,
        0
    );

    addStreetPole(
        0,
        -28
    );

    addStreetPole(
        0,
        28
    );


    addTirePile(
        -15,
        5
    );

    addTirePile(
        15,
        -5
    );


    addDeadTree(
        -10,
        30
    );

    addDeadTree(
        10,
        30
    );

    addDeadTree(
        -10,
        -30
    );

    addDeadTree(
        10,
        -30
    );


    addRubblePile(
        -42,
        -10
    );

    addRubblePile(
        42,
        -10
    );

    addRubblePile(
        -42,
        10
    );

    addRubblePile(
        42,
        10
    );


    addBarrel(-40, -12);
    addBarrel(-38, -12);

    addBarrel(40, -12);
    addBarrel(38, -12);

    addBarrel(-40, 12);
    addBarrel(-38, 12);

    addBarrel(40, 12);
    addBarrel(38, 12);
}


// =====================================================
// MODELOS 3D
// =====================================================

const modelLoader =
    new GLTFLoader();


const modelPath =
    "/assets/models/Models/GLB%20format/building-type-l.glb";


const modelPositions = [

    {
        x: -25,
        z: -25,
        width: 20,
        height: 15,
        depth: 20
    },

    {
        x: 25,
        z: -25,
        width: 25,
        height: 20,
        depth: 20
    },

    {
        x: -25,
        z: 25,
        width: 22,
        height: 18,
        depth: 25
    },

    {
        x: 25,
        z: 25,
        width: 20,
        height: 14,
        depth: 20
    },

    {
        x: -55,
        z: 0,
        width: 20,
        height: 25,
        depth: 25
    },

    {
        x: 55,
        z: 0,
        width: 20,
        height: 22,
        depth: 25
    }

];


// =====================================================
// DECORACIÓN VERDE
// =====================================================

const decorationObjects = [];


// =====================================================
// CARGAR MODELOS
// =====================================================

modelLoader.load(

    modelPath,

    function (gltf) {

        console.log(
            "🏢 MODELO 3D CARGADO"
        );


        const original =
            gltf.scene;


        const scale = 5;


        modelPositions.forEach(
            function (
                position,
                index
            ) {

                const model =
                    original.clone(true);


                model.position.set(
                    position.x,
                    0,
                    position.z
                );


                model.scale.set(
                    scale,
                    scale,
                    scale
                );


                model.traverse(
                    function (object) {

                        if (
                            object.isMesh
                        ) {

                            object.castShadow =
                                true;

                            object.receiveShadow =
                                true;
                        }

                    }
                );


                scene.add(model);


                decorateRuin(
                    position.x,
                    position.z,
                    position.width,
                    position.height,
                    position.depth
                );


                decorateBuildingSides(
                    position.x,
                    position.z,
                    position.width,
                    position.height,
                    position.depth
                );


                // LETRERO

                const signGeometry =
                    new THREE.BoxGeometry(
                        6,
                        1.2,
                        0.18
                    );


                const signMaterial =
                    new THREE.MeshStandardMaterial({
                        color: 0x00aa66,
                        emissive: 0x00ff88,
                        emissiveIntensity: 2
                    });


                const sign =
                    addMesh(
                        signGeometry,
                        signMaterial,
                        position.x,
                        11,
                        position.z -
                        position.depth / 2 -
                        0.5
                    );


                const signLight =
                    new THREE.PointLight(
                        0x00ff88,
                        3,
                        12
                    );


                signLight.position.set(
                    position.x,
                    11,
                    position.z -
                    position.depth / 2 -
                    1
                );


                scene.add(
                    signLight
                );


                decorationObjects.push({
                    sign,
                    signLight,
                    offset: index * 0.8
                });

            }
        );


        fillCity();


        console.log(
            "🏚️ CIUDAD COMPLETA CREADA"
        );

    },


    function (progress) {

        if (
            progress.total > 0
        ) {

            const percent =
                Math.round(
                    (
                        progress.loaded /
                        progress.total
                    ) * 100
                );


            console.log(
                "Cargando edificio:",
                percent + "%"
            );
        }

    },


    function (error) {

        console.error(
            "❌ ERROR AL CARGAR EL MODELO:",
            error
        );

    }

);


// =====================================================
// ZOMBIES
// =====================================================

const zombies = [];


function spawnZombie(
    x,
    z
) {

    const zombie =
        new Zombie(
            scene,
            new THREE.Vector3(
                x,
                0,
                z
            )
        );


    zombies.push(
        zombie
    );


    console.log(
        "🧟 ZOMBIE CREADO:",
        x,
        z
    );
}


// =====================================================
// ZOMBIES INICIALES
// =====================================================

spawnZombie(-10, -20);
spawnZombie(10, -20);
spawnZombie(-15, 15);
spawnZombie(15, 15);
spawnZombie(0, 30);


// =====================================================
// ACTUALIZAR ZOMBIES
// =====================================================

function updateZombies(
    delta
) {

    if (
        !controls.isLocked
    ) {
        return;
    }


    const playerPosition =
        camera.position;


    zombies.forEach(
        function (zombie) {

            zombie.update(
                playerPosition,
                delta
            );

        }
    );
}


// =====================================================
// TECLADO
// =====================================================

const keys = {};


document.addEventListener(
    "keydown",
    function (event) {

        keys[event.code] = true;


        if (
            event.code === "Space"
        ) {

            event.preventDefault();
        }

    }
);


document.addEventListener(
    "keyup",
    function (event) {

        keys[event.code] = false;

    }
);


// =====================================================
// SALTO
// =====================================================

let velocityY = 0;

let grounded = true;

const gravity = 25;

const jumpPower = 9;


// =====================================================
// PASOS
// =====================================================

let lastStepTime = 0;


function updateFootsteps() {

    if (
        !controls.isLocked
    ) {
        return;
    }


    const moving =
        keys["KeyW"] ||
        keys["KeyS"] ||
        keys["KeyA"] ||
        keys["KeyD"];


    if (
        !moving ||
        !grounded
    ) {

        return;
    }


    const now =
        performance.now();


    const running =
        keys["ShiftLeft"] ||
        keys["ShiftRight"];


    const interval =
        running
            ? 280
            : 400;


    if (
        now -
        lastStepTime >
        interval
    ) {

        playSound(
            "footsteps"
        );

        lastStepTime =
            now;
    }
}


// =====================================================
// RELOJ
// =====================================================

const clock =
    new THREE.Clock();


// =====================================================
// MOVIMIENTO
// =====================================================

function updateMovement(
    delta
) {

    if (
        !controls.isLocked
    ) {
        return;
    }


    let speed = 8;


    if (
        keys["ShiftLeft"] ||
        keys["ShiftRight"]
    ) {

        speed = 14;
    }


    const oldX =
        camera.position.x;


    const oldZ =
        camera.position.z;


    if (
        keys["KeyW"]
    ) {

        controls.moveForward(
            speed * delta
        );
    }


    if (
        keys["KeyS"]
    ) {

        controls.moveForward(
            -speed * delta
        );
    }


    if (
        keys["KeyA"]
    ) {

        controls.moveRight(
            -speed * delta
        );
    }


    if (
        keys["KeyD"]
    ) {

        controls.moveRight(
            speed * delta
        );
    }


    // COLISIÓN DEL JUGADOR

    if (
        collisions.isBlocked(
            camera.position.x,
            camera.position.z
        )
    ) {

        const attemptedX =
            camera.position.x;

        const attemptedZ =
            camera.position.z;


        camera.position.x =
            oldX;

        camera.position.z =
            oldZ;


        if (
            !collisions.isBlocked(
                attemptedX,
                oldZ
            )
        ) {

            camera.position.x =
                attemptedX;
        }


        if (
            !collisions.isBlocked(
                camera.position.x,
                attemptedZ
            )
        ) {

            camera.position.z =
                attemptedZ;
        }
    }


    // SALTO

    if (
        keys["Space"] &&
        grounded
    ) {

        velocityY =
            jumpPower;

        grounded =
            false;

        playSound(
            "jump"
        );
    }


    velocityY -=
        gravity *
        delta;


    camera.position.y +=
        velocityY *
        delta;


    if (
        camera.position.y <= 2
    ) {

        camera.position.y = 2;

        velocityY = 0;

        grounded = true;
    }
}


// =====================================================
// ANIMACIÓN DE LA CIUDAD
// =====================================================

function animateRuins(
    time
) {

    decorationObjects.forEach(
        function (decoration) {

            const pulse =
                Math.sin(
                    time * 3 +
                    decoration.offset
                );


            decoration.sign
                .material
                .emissiveIntensity =

                1.5 +
                (pulse + 1) *
                0.7;


            decoration.signLight.intensity =

                2 +
                (pulse + 1);

        }
    );


    ruinLights.forEach(
        function (ruin) {

            const flicker =
                Math.sin(
                    time * 9 +
                    ruin.offset
                );


            if (
                Math.random() > 0.94
            ) {

                ruin.light.intensity =
                    0.2;


                ruin.bulb
                    .material
                    .emissiveIntensity =
                    0.4;

            } else {

                ruin.light.intensity =
                    1.2 +
                    Math.max(
                        0,
                        flicker
                    ) *
                    0.8;


                ruin.bulb
                    .material
                    .emissiveIntensity =
                    2 +
                    Math.max(
                        0,
                        flicker
                    ) *
                    2;
            }

        }
    );
}


// =====================================================
// ANIMACIÓN PRINCIPAL
// =====================================================

function animate() {

    requestAnimationFrame(
        animate
    );


    const delta =
        Math.min(
            clock.getDelta(),
            0.05
        );


    animateRuins(
        performance.now() / 1000
    );


    updateMovement(
        delta
    );


    updateFootsteps();


    updateZombies(
        delta
    );


    renderer.render(
        scene,
        camera
    );
}


animate();


// =====================================================
// RESIZE
// =====================================================

window.addEventListener(
    "resize",
    function () {

        camera.aspect =
            window.innerWidth /
            window.innerHeight;


        camera.updateProjectionMatrix();


        renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );

    }
);