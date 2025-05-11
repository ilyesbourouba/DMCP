-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : lun. 12 mai 2025 à 01:08
-- Version du serveur : 10.4.27-MariaDB
-- Version de PHP : 8.1.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `dmcp`
--

-- --------------------------------------------------------

--
-- Structure de la table `category`
--

CREATE TABLE `category` (
  `id` int(11) NOT NULL,
  `name_en` varchar(1000) NOT NULL,
  `name_fr` varchar(1000) NOT NULL,
  `name_ar` varchar(1000) NOT NULL,
  `image` varchar(1000) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Déchargement des données de la table `category`
--

INSERT INTO `category` (`id`, `name_en`, `name_fr`, `name_ar`, `image`) VALUES
(3, 'llyes_en', 'llyes_FR', 'لييس', 'http://localhost:3000/uploads/1746646806271_llyes_FR.png'),
(4, 'dino_EN', 'dino_FR', 'ديناصور', 'http://localhost:3000/uploads/1746646798854_dino_FR.png'),
(8, 'srir_EN', 'srir', 'غامض', 'http://localhost:3000/uploads/1746646818017_srir.png'),
(11, 'Deadpool_EN', 'Deadpool_FR', 'تجمع القتلى', 'http://localhost:3000/uploads/1746646788005_Deadpool_FR.png'),
(13, 'NACER DJITLI', 'caty', 'DJITLI', 'http://localhost:3000/uploads/1746646780057_caty.png'),
(18, 'test img', 'test img', 'test img', 'http://localhost:3000/uploads/1746646828643_test_img.png');

-- --------------------------------------------------------

--
-- Structure de la table `client`
--

CREATE TABLE `client` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `adr` text NOT NULL,
  `wilaya` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `token` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Déchargement des données de la table `client`
--

INSERT INTO `client` (`id`, `name`, `phone`, `email`, `adr`, `wilaya`, `password`, `token`) VALUES
(1, 'ilyes', '0551316015', 'mapdoua@gmail.com', 'zeralda', '0', '$2a$12$jFthR95e3SulaVDIOTY4dumqNJM.gUP1HoyZR/rIbimsXGDKRmvoG', '$2a$12$jFthR95e3SulaVDIOTY4dumqNJM.gUP1HoyZR/rIbimsXGDKRmvoG'),
(15, 'maroua', '0551316018', 'maroua@gmail.com', 'zeralda', '0', '$2a$10$Iz15ndJXYZbIl3x/J3LC2.bLotBNSxG.BH3YNM9UAHtEDnlWHkjTW', NULL);

-- --------------------------------------------------------

--
-- Structure de la table `commande`
--

CREATE TABLE `commande` (
  `id` int(11) NOT NULL,
  `client_id` int(11) DEFAULT NULL,
  `total` int(11) NOT NULL,
  `date_commande` timestamp NOT NULL DEFAULT current_timestamp(),
  `status_id` int(11) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Déchargement des données de la table `commande`
--

INSERT INTO `commande` (`id`, `client_id`, `total`, `date_commande`, `status_id`) VALUES
(3, 1, 1250, '2025-04-29 22:49:41', 2),
(5, 1, 530, '2025-04-29 22:50:44', 1),
(6, 1, 530, '2025-04-29 22:57:50', 5),
(10, 1, 170, '2025-04-30 23:39:54', 4),
(11, 1, 290, '2025-05-01 19:15:09', 3),
(12, 1, 996, '2025-05-10 19:44:06', 1),
(13, 1, 223, '2025-05-10 20:09:16', 1);

-- --------------------------------------------------------

--
-- Structure de la table `commande_product`
--

CREATE TABLE `commande_product` (
  `commande_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Déchargement des données de la table `commande_product`
--

INSERT INTO `commande_product` (`commande_id`, `product_id`, `quantity`) VALUES
(3, 2, 10),
(6, 6, 2),
(10, 6, 1),
(11, 2, 1),
(11, 6, 1),
(13, 6, 1);

-- --------------------------------------------------------

--
-- Structure de la table `commande_status`
--

CREATE TABLE `commande_status` (
  `id` int(11) NOT NULL,
  `status_en` varchar(255) NOT NULL,
  `status_fr` varchar(255) NOT NULL,
  `status_ar` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Déchargement des données de la table `commande_status`
--

INSERT INTO `commande_status` (`id`, `status_en`, `status_fr`, `status_ar`) VALUES
(1, 'pending', 'en attente', 'معلق'),
(2, 'in shipping', 'en cours de livraison', 'قيد الشحن'),
(3, 'delivered', 'livré', 'تم التسليم'),
(4, 'paid', 'payé', 'مدفوع'),
(5, 'cancelled', 'annulé', 'تم الإلغاء');

-- --------------------------------------------------------

--
-- Structure de la table `favoris`
--

CREATE TABLE `favoris` (
  `client_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `livraison`
--

CREATE TABLE `livraison` (
  `price` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Déchargement des données de la table `livraison`
--

INSERT INTO `livraison` (`price`) VALUES
(99);

-- --------------------------------------------------------

--
-- Structure de la table `pack`
--

CREATE TABLE `pack` (
  `id` int(11) NOT NULL,
  `name_en` varchar(255) NOT NULL,
  `name_fr` varchar(255) NOT NULL,
  `name_ar` varchar(255) NOT NULL,
  `description_fr` text DEFAULT NULL,
  `description_ar` text NOT NULL,
  `description_en` text NOT NULL,
  `total_price` int(11) DEFAULT 0,
  `image` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Déchargement des données de la table `pack`
--

INSERT INTO `pack` (`id`, `name_en`, `name_fr`, `name_ar`, `description_fr`, `description_ar`, `description_en`, `total_price`, `image`) VALUES
(4, 'extension ', 'prolongation', 'امتداد', 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.', 'امتدادامتداد امتداد امتداد امتداد امتداد امتداد  امتدادامتداد امتداد امتداد امتداد امتداد امتداد  امتدادامتداد امتداد امتداد امتداد امتداد امتداد  ', 'publishing', 0, 'http://192.168.100.7:3000/uploads/1746231154093_ilyes.png'),
(13, 'bourouba ilyes', 'ilyes', 'bourouba', 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.', 'ilyesEdit ', 'ilyesEdit ', 0, 'http://192.168.100.7:3000/uploads/1746317890087_ilyes.png');

-- --------------------------------------------------------

--
-- Structure de la table `pack_product`
--

CREATE TABLE `pack_product` (
  `pack_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Déchargement des données de la table `pack_product`
--

INSERT INTO `pack_product` (`pack_id`, `product_id`) VALUES
(4, 2),
(4, 6),
(4, 8),
(13, 6),
(13, 8);

-- --------------------------------------------------------

--
-- Structure de la table `panier`
--

CREATE TABLE `panier` (
  `client_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `product`
--

CREATE TABLE `product` (
  `id` int(11) NOT NULL,
  `name_fr` varchar(1000) NOT NULL,
  `name_en` varchar(1000) NOT NULL,
  `name_ar` varchar(1000) NOT NULL,
  `desc_fr` text DEFAULT NULL,
  `desc_en` text NOT NULL,
  `desc_ar` text NOT NULL,
  `price` int(11) NOT NULL,
  `stock` int(11) DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `best_selling` tinyint(1) DEFAULT 0,
  `new_product` tinyint(1) DEFAULT 0,
  `top_rating` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Déchargement des données de la table `product`
--

INSERT INTO `product` (`id`, `name_fr`, `name_en`, `name_ar`, `desc_fr`, `desc_en`, `desc_ar`, `price`, `stock`, `category_id`, `best_selling`, `new_product`, `top_rating`) VALUES
(2, 'verre', 'glass', 'زجاج', 'Alors que David affronte Kevin, un groupe d\'hommes armés intervient.', 'While David confronts Kevin, a group of armed men intervene.', 'بينما يواجه ديفيد كيفن، تتدخل مجموعة من الرجال المسلحين.', 120, 45, 13, 1, 1, 0),
(6, 'name_fr', 'name_en', 'اسم عربي', 'desc_fr', 'La transparence, le respect, l\'union, la solidarité et le triomphe sont les valeurs fondamentales qui ont guidé notre succès et continueront à nous renforcer à l\'avenir.\r\n* ilyes bourouba \r\n* meroua souici', 'desc_ar', 120, 1000, 18, 1, 1, 1),
(8, 'Nom francais', 'Nom anglais', 'Nom arabe', 'Edit Category\r\n', 'Edit Category\r\n', 'Edit Category\r\n', 9, 9, 11, 0, 0, 1),
(11, 'Lorem Ipsum', 'tes img', 'tes img', 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.', 'tes img', 'tes img', 2, 12, 18, 0, 1, 1);

-- --------------------------------------------------------

--
-- Structure de la table `product_feature`
--

CREATE TABLE `product_feature` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `feature_en` varchar(1000) NOT NULL,
  `feature_fr` varchar(1000) NOT NULL,
  `feature_ar` varchar(1000) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Déchargement des données de la table `product_feature`
--

INSERT INTO `product_feature` (`id`, `product_id`, `feature_en`, `feature_fr`, `feature_ar`) VALUES
(1, 1, 'call fucntion', 'fonction d\'appel', 'وظيفة الاستدعاء'),
(2, 1, 'LED indicator', 'indicateur LED', 'مؤشر LED');

-- --------------------------------------------------------

--
-- Structure de la table `product_images`
--

CREATE TABLE `product_images` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `image_url` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Déchargement des données de la table `product_images`
--

INSERT INTO `product_images` (`id`, `product_id`, `image_url`) VALUES
(15, 11, 'http://localhost:3000/uploads/1746317999558_tes_img.png'),
(20, 6, 'http://localhost:3000/uploads/1746744950667_name_fr.png'),
(21, 6, 'http://localhost:3000/uploads/1746744950671_name_fr.png'),
(22, 8, 'http://localhost:3000/uploads/1746745021245_Nom_francais.png'),
(23, 8, 'http://localhost:3000/uploads/1746745021245_Nom_francais.png'),
(24, 2, 'http://localhost:3000/uploads/1746745036310_verre.png'),
(25, 2, 'http://localhost:3000/uploads/1746745036310_verre.png');

-- --------------------------------------------------------

--
-- Structure de la table `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Déchargement des données de la table `user`
--

INSERT INTO `user` (`id`, `username`, `password`) VALUES
(1, 'bourouba ilyes', '$2a$12$os8.EBX.TseflHwwgpszjuTD/oMnnB9yh42EfVrriToRBku8JR0j6');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `client`
--
ALTER TABLE `client`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Index pour la table `commande`
--
ALTER TABLE `commande`
  ADD PRIMARY KEY (`id`),
  ADD KEY `client_id` (`client_id`),
  ADD KEY `fk_commande_status` (`status_id`);

--
-- Index pour la table `commande_product`
--
ALTER TABLE `commande_product`
  ADD PRIMARY KEY (`commande_id`,`product_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Index pour la table `commande_status`
--
ALTER TABLE `commande_status`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `favoris`
--
ALTER TABLE `favoris`
  ADD PRIMARY KEY (`client_id`,`product_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Index pour la table `pack`
--
ALTER TABLE `pack`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `pack_product`
--
ALTER TABLE `pack_product`
  ADD PRIMARY KEY (`pack_id`,`product_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Index pour la table `panier`
--
ALTER TABLE `panier`
  ADD PRIMARY KEY (`client_id`,`product_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Index pour la table `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`id`),
  ADD KEY `category_id` (`category_id`);

--
-- Index pour la table `product_feature`
--
ALTER TABLE `product_feature`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `product_images`
--
ALTER TABLE `product_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`);

--
-- Index pour la table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `category`
--
ALTER TABLE `category`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT pour la table `client`
--
ALTER TABLE `client`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT pour la table `commande`
--
ALTER TABLE `commande`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT pour la table `commande_status`
--
ALTER TABLE `commande_status`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT pour la table `pack`
--
ALTER TABLE `pack`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT pour la table `product`
--
ALTER TABLE `product`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT pour la table `product_feature`
--
ALTER TABLE `product_feature`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `product_images`
--
ALTER TABLE `product_images`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT pour la table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `commande`
--
ALTER TABLE `commande`
  ADD CONSTRAINT `commande_ibfk_1` FOREIGN KEY (`client_id`) REFERENCES `client` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_commande_status` FOREIGN KEY (`status_id`) REFERENCES `commande_status` (`id`);

--
-- Contraintes pour la table `commande_product`
--
ALTER TABLE `commande_product`
  ADD CONSTRAINT `commande_product_ibfk_1` FOREIGN KEY (`commande_id`) REFERENCES `commande` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `commande_product_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `favoris`
--
ALTER TABLE `favoris`
  ADD CONSTRAINT `favoris_ibfk_1` FOREIGN KEY (`client_id`) REFERENCES `client` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `favoris_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `pack_product`
--
ALTER TABLE `pack_product`
  ADD CONSTRAINT `pack_product_ibfk_1` FOREIGN KEY (`pack_id`) REFERENCES `pack` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `pack_product_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `panier`
--
ALTER TABLE `panier`
  ADD CONSTRAINT `fk_panier_client` FOREIGN KEY (`client_id`) REFERENCES `client` (`id`),
  ADD CONSTRAINT `panier_ibfk_1` FOREIGN KEY (`client_id`) REFERENCES `client` (`id`),
  ADD CONSTRAINT `panier_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`);

--
-- Contraintes pour la table `product`
--
ALTER TABLE `product`
  ADD CONSTRAINT `product_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`) ON DELETE SET NULL;

--
-- Contraintes pour la table `product_images`
--
ALTER TABLE `product_images`
  ADD CONSTRAINT `product_images_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
