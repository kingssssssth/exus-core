// =====================================================
// EXUS CORE - SISTEMA DE ZOMBIES
// =====================================================

import * as THREE from "three";

export class Zombie {

    constructor(scene, position) {

        this.scene = scene;

        // =================================================
        // ESTADÍSTICAS
        // =================================================

        this.health = 100;
        this.maxHealth = 100;

        this.speed = 2.2;

        this.damage = 10;

        this.attackDistance = 1.6;

        this.attackCooldown = 1000;

        this.lastAttack = 0;

        this.alive = true;

        // =================================================
        // OBJETO PRINCIPAL
        // =================================================

        this.object =
            new THREE.Group();

        this.object.position.copy(
            position
        );

        // Referencia para las balas
        this.object.userData.zombie =
            this;

        scene.add(
            this.object
        );

        // =================================================
        // CREAR ZOMBI TEMPORAL
        // =================================================

        this.createPlaceholder();

    }


    // =====================================================
    // ZOMBI TEMPORAL
    // =====================================================

    createPlaceholder() {

        // Material de piel
        const skinMaterial =
            new THREE.MeshStandardMaterial({

                color: 0x66705f,

                roughness: 0.9

            });


        // Material de ropa
        const clothesMaterial =
            new THREE.MeshStandardMaterial({

                color: 0x252b2d,

                roughness: 1

            });


        // =================================================
        // CABEZA
        // =================================================

        const head =
            new THREE.Mesh(

                new THREE.SphereGeometry(
                    0.36,
                    20,
                    20
                ),

                skinMaterial

            );

        head.position.y =
            1.75;

        head.userData.zombie =
            this;

        head.castShadow = true;

        this.object.add(
            head
        );


        // =================================================
        // CUELLO
        // =================================================

        const neck =
            new THREE.Mesh(

                new THREE.CylinderGeometry(
                    0.18,
                    0.2,
                    0.3,
                    12
                ),

                skinMaterial

            );

        neck.position.y =
            1.4;

        neck.castShadow = true;

        this.object.add(
            neck
        );


        // =================================================
        // CUERPO
        // =================================================

        const body =
            new THREE.Mesh(

                new THREE.CapsuleGeometry(
                    0.38,
                    0.8,
                    8,
                    16
                ),

                clothesMaterial

            );

        body.position.y =
            0.95;

        body.userData.zombie =
            this;

        body.castShadow = true;

        body.receiveShadow = true;

        this.object.add(
            body
        );


        // =================================================
        // BRAZO IZQUIERDO
        // =================================================

        const armGeometry =
            new THREE.CapsuleGeometry(
                0.12,
                0.75,
                6,
                10
            );


        const leftArm =
            new THREE.Mesh(

                armGeometry,

                clothesMaterial

            );

        leftArm.position.set(
            -0.48,
            1.05,
            0
        );

        leftArm.rotation.z =
            -0.35;

        leftArm.castShadow = true;

        leftArm.userData.zombie =
            this;

        this.object.add(
            leftArm
        );


        // =================================================
        // BRAZO DERECHO
        // =================================================

        const rightArm =
            new THREE.Mesh(

                armGeometry,

                clothesMaterial

            );

        rightArm.position.set(
            0.48,
            1.05,
            0
        );

        rightArm.rotation.z =
            0.35;

        rightArm.castShadow = true;

        rightArm.userData.zombie =
            this;

        this.object.add(
            rightArm
        );


        // =================================================
        // PIERNAS
        // =================================================

        const legGeometry =
            new THREE.CapsuleGeometry(
                0.14,
                0.75,
                6,
                10
            );


        const leftLeg =
            new THREE.Mesh(

                legGeometry,

                clothesMaterial

            );

        leftLeg.position.set(
            -0.2,
            0.25,
            0
        );

        leftLeg.castShadow = true;

        leftLeg.userData.zombie =
            this;

        this.object.add(
            leftLeg
        );


        const rightLeg =
            new THREE.Mesh(

                legGeometry,

                clothesMaterial

            );

        rightLeg.position.set(
            0.2,
            0.25,
            0
        );

        rightLeg.castShadow = true;

        rightLeg.userData.zombie =
            this;

        this.object.add(
            rightLeg
        );


        // =================================================
        // OJOS
        // =================================================

        const eyeMaterial =
            new THREE.MeshStandardMaterial({

                color: 0xff2200,

                emissive: 0xff0000,

                emissiveIntensity: 4

            });


        const leftEye =
            new THREE.Mesh(

                new THREE.SphereGeometry(
                    0.055,
                    8,
                    8
                ),

                eyeMaterial

            );

        leftEye.position.set(
            -0.13,
            1.8,
            -0.32
        );

        this.object.add(
            leftEye
        );


        const rightEye =
            new THREE.Mesh(

                new THREE.SphereGeometry(
                    0.055,
                    8,
                    8
                ),

                eyeMaterial

            );

        rightEye.position.set(
            0.13,
            1.8,
            -0.32
        );

        this.object.add(
            rightEye
        );

    }


    // =====================================================
    // ACTUALIZAR
    // =====================================================

    update(
        playerPosition,
        delta
    ) {

        if (!this.alive) {
            return;
        }


        const direction =
            new THREE.Vector3();


        direction.subVectors(

            playerPosition,

            this.object.position

        );


        const distance =
            direction.length();


        // =================================================
        // MIRAR AL JUGADOR
        // =================================================

        if (distance > 0.1) {

            const angle =
                Math.atan2(
                    direction.x,
                    direction.z
                );

            this.object.rotation.y =
                angle;

        }


        // =================================================
        // PERSEGUIR
        // =================================================

        if (
            distance >
            this.attackDistance
        ) {

            direction.normalize();


            this.object.position.x +=
                direction.x *
                this.speed *
                delta;


            this.object.position.z +=
                direction.z *
                this.speed *
                delta;

        }


        // =================================================
        // ANIMACIÓN SIMPLE
        // =================================================

        const time =
            performance.now() *
            0.006;


        if (
            distance >
            this.attackDistance
        ) {

            this.object.children.forEach(
                (child, index) => {

                    if (
                        index === 2 ||
                        index === 3
                    ) {

                        child.rotation.x =
                            Math.sin(
                                time
                            ) * 0.35;

                    }

                }
            );

        }


        // =================================================
        // ATAQUE
        // =================================================

        if (
            distance <=
            this.attackDistance
        ) {

            this.attack();

        }

    }


    // =====================================================
    // ATAQUE
    // =====================================================

    attack() {

        const now =
            performance.now();


        if (
            now -
            this.lastAttack <
            this.attackCooldown
        ) {

            return;

        }


        this.lastAttack =
            now;


        console.log(
            "🧟 ZOMBIE ATACANDO"
        );

    }


    // =====================================================
    // RECIBIR DAÑO
    // =====================================================

    takeDamage(
        amount
    ) {

        if (
            !this.alive
        ) {

            return;

        }


        this.health -=
            amount;


        console.log(
            "🩸 Zombi:",
            this.health,
            "HP"
        );


        // =================================================
        // EFECTO DE IMPACTO
        // =================================================

        this.object.traverse(

            child => {

                if (
                    !child.isMesh
                ) {

                    return;

                }


                if (
                    !child.material ||
                    !child.material.color
                ) {

                    return;

                }


                const original =
                    child.material.color.clone();


                child.material.color.set(
                    0xff0000
                );


                setTimeout(
                    () => {

                        if (
                            child.material &&
                            child.material.color
                        ) {

                            child.material.color.copy(
                                original
                            );

                        }

                    },
                    100
                );

            }

        );


        // =================================================
        // MUERTE
        // =================================================

        if (
            this.health <= 0
        ) {

            this.die();

        }

    }


    // =====================================================
    // MORIR
    // =====================================================

    die() {

        if (
            !this.alive
        ) {

            return;

        }


        this.alive =
            false;


        console.log(
            "💀 ZOMBI ELIMINADO"
        );


        const startTime =
            performance.now();


        const duration =
            600;


        const startRotation =
            this.object.rotation.x;


        const deathAnimation =
            () => {

                const elapsed =
                    performance.now() -
                    startTime;


                const progress =
                    Math.min(
                        elapsed /
                        duration,
                        1
                    );


                this.object.rotation.x =
                    startRotation +
                    progress *
                    (Math.PI / 2);


                this.object.position.y =
                    progress *
                    -0.35;


                if (
                    progress <
                    1
                ) {

                    requestAnimationFrame(
                        deathAnimation
                    );

                } else {

                    this.remove();

                }

            };


        deathAnimation();

    }


    // =====================================================
    // ELIMINAR
    // =====================================================

    remove() {

        if (
            this.object.parent
        ) {

            this.object.parent.remove(
                this.object
            );

        }

    }

}